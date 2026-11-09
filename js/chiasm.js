/* The 70-fold chiasm viewer: folding arcs, band chips, pair-by-pair walk, and the full fold.
   Adapted from the Oct 26-28 deck code (drawArcs, BandStop, FullFold). */
window.Chiasm = (function(){
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const STOP = new Set("the and of to in that his he him unto a an is was were be for with which who they them their this these those but not all as by from on upon shall will i my me thee thou thy ye you your it its have hath had are or there what when so saith said say also any no one into out up our we us her she shalt doth hast let even every after before".split(" "));
const words = t => new Set((t.toLowerCase().match(/[a-z’']+/g)||[]).map(w=>w.replace(/[’']s$/,"")).filter(w=>w.length>2&&!STOP.has(w)));
const mark = (t,sh,on) => esc(t).replace(/[A-Za-z’']+/g, w => { const k=w.toLowerCase().replace(/[’']s$/,""); return on&&sh.has(k)?`<mark>${w}</mark>`:w; });

let st = null, keyH = null, autoT = null;

function mount(el, data, startLabel){
  const P = data.pairs, NP = P.length, N = NP*2+1;
  const bandOf = p => data.bands.findIndex(b => b.members.includes(P[p].label));
  const seq = []; P.forEach(x=>seq.push(x.L.ref)); seq.push(data.center.ref); for(let p=NP-1;p>=0;p--) seq.push(P[p].R.ref);
  const start = Math.max(0, P.findIndex(x=>x.label===startLabel));
  st = {el, data, P, NP, N, bandOf, seq, pair: startLabel ? start : NP, band: null, mode: "walk", shared: true};

  el.innerHTML = `
  <div class="cx">
    <p class="eyebrow">The Poetry of John's Apocalypse · Chiasm</p>
    <h1>The 70-Fold Chiasm</h1>
    <p class="lede">Seventy mirrored pairs in the Book of Revelation, centered on JST 12:11. Each arc joins a passage to its mirror; tap one to read the pair.</p>
    <p class="cx-credit">Chiasm identified by Hyrum W. Hawks · ${esc(data.version)}</p>
    <div class="cx-tabs"><button data-m="walk">Pair by pair</button><button data-m="fold">The full fold</button><label class="cx-tog"><input type="checkbox" id="cxShared" checked> Mark shared words</label></div>
    <div class="cx-stack">
      <div class="arcbox"><svg id="cxArcs" role="img" aria-label="Arc diagram: 70 arcs joining mirrored passages across the book"></svg></div>
      <div class="bands" id="cxBands"></div>
      <div id="cxBody"></div>
    </div>
    <p class="cx-note">KJV text, with the Joseph Smith Translation where marked JST. Chapter 12 follows JST verse numbers. Shared words are found by simple word matching, leaving out common words.</p>
  </div>`;

  el.querySelector("#cxBands").innerHTML = `<button data-b="-1" class="on">All bands</button>` +
    data.bands.map((b,i)=>`<button data-b="${i}"><b>${i+1}</b> ${esc(b.name)}</button>`).join("");
  el.querySelectorAll("#cxBands button").forEach(b => b.onclick = () => {
    const i = +b.dataset.b; st.band = i<0 ? null : i;
    if(st.band!=null && st.mode==="walk"){ const first = P.findIndex(x=>x.label===data.bands[i].members[0]); st.pair = first; }
    render();
    if(st.band!=null && st.mode==="fold"){ const r = el.querySelector(`.frow[data-b="${i}"]`); if(r) r.scrollIntoView({behavior:"smooth",block:"center"}); }
  });
  el.querySelectorAll(".cx-tabs button").forEach(b => b.onclick = () => { st.mode = b.dataset.m; stopAuto(); render(); });
  el.querySelector("#cxShared").onchange = e => { st.shared = e.target.checked; render(); };

  keyH = e => {
    if(e.target.closest && e.target.closest("input,textarea")) return;
    if(e.key==="ArrowRight"||e.key==="ArrowDown"&&st.mode==="walk"){ go(st.pair+1); e.preventDefault(); }
    else if(e.key==="ArrowLeft"||e.key==="ArrowUp"&&st.mode==="walk"){ go(st.pair-1); e.preventDefault(); }
  };
  document.addEventListener("keydown", keyH);
  window.addEventListener("resize", drawArcs);
  render();
}

function go(p){ st.pair = Math.max(0, Math.min(st.NP, p)); render(); }

function drawArcs(){
  if(!st) return;
  const svg = st.el.querySelector("#cxArcs"); if(!svg) return;
  const {N, NP, seq, P} = st;
  const W = Math.max(600, svg.clientWidth || 1000), H = Math.round(Math.min(W*0.2, 230)), pad = 14, y0 = H-30;
  const dx = (W-2*pad)/(N-1), X = i => pad+i*dx, k = (y0-10)/((N-1)/2*dx);
  let s = "";
  for(let p=0;p<NP;p++){
    const x1=X(p), x2=X(N-1-p), rx=(x2-x1)/2, ry=rx*k, b=st.bandOf(p);
    const sel = p===st.pair, dimmed = st.band!=null && b!==st.band;
    const d = `M${x1.toFixed(1)} ${y0} A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y0}`;
    s += `<path d="${d}" class="arc${sel?" sel":""}${dimmed?" dim":""}"/>`;
    s += `<path d="${d}" class="hit" data-p="${p}"><title>${esc(P[p].label)} · ${esc(P[p].L.ref)} ↔ ${esc(P[p].R.ref)}</title></path>`;
  }
  s += `<line x1="${pad}" y1="${y0}" x2="${W-pad}" y2="${y0}" class="base"/>`;
  s += `<circle cx="${X(NP)}" cy="${y0}" r="6" class="ctr${st.pair===NP?" sel":""}" data-p="${NP}"/>`;
  let last = "", lastX = -99, gap = W<900 ? 22 : 16;
  seq.forEach((r,i) => { const ch = r.split(":")[0]; if(ch!==last){ last = ch; if(X(i)-lastX>=gap){ lastX = X(i); s += `<text x="${X(i).toFixed(1)}" y="${y0+20}" class="tick">${ch}</text>`; } } });
  s += `<text x="${X(NP)}" y="${y0-14}" class="ctrlab">12:11</text>`;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.innerHTML = s;
  svg.querySelectorAll("[data-p]").forEach(a => a.onclick = () => { if(st.mode==="fold"){ st.mode="walk"; } go(+a.dataset.p); });
}

function srcTag(x){ return x.src==="JST" || (x.ref.startsWith("12:")) ? ` <span class="jst">JST</span>` : ""; }

function render(){
  const {el, P, NP, data} = st;
  el.querySelectorAll(".cx-tabs button").forEach(b => b.classList.toggle("on", b.dataset.m===st.mode));
  el.querySelector(".cx").classList.toggle("walk", st.mode==="walk");
  el.querySelectorAll("#cxBands button").forEach(b => b.classList.toggle("on", (+b.dataset.b) === (st.band==null?-1:st.band)));
  drawArcs();
  const body = el.querySelector("#cxBody");
  if(st.mode==="walk"){
    const p = st.pair;
    let card;
    if(p===NP){
      const c = data.center;
      card = `<div class="pcard ctrcard"><span class="lab">${esc(c.label)} · the center</span><span class="ref">${esc(c.ref)} <span class="jst">JST</span></span><p>${esc(c.text)}</p></div>`;
    } else {
      const x = P[p], sh = new Set([...words(x.L.text)].filter(w=>words(x.R.text).has(w)));
      card = `<div class="pcard"><div class="half"><span class="lab">${esc(x.label)}</span><span class="ref">${esc(x.L.ref)}${srcTag(x.L)}</span><p>${mark(x.L.text,sh,st.shared)}</p></div>
        <div class="hinge" aria-hidden="true"></div>
        <div class="half"><span class="lab">${esc(x.label)}′</span><span class="ref">${esc(x.R.ref)}${srcTag(x.R)}</span><p>${mark(x.R.text,sh,st.shared)}</p></div></div>`;
    }
    const b = p<NP ? st.bandOf(p) : -1;
    const where = p<NP ? `Pair ${p+1} of ${NP} · Band ${b+1}: ${esc(data.bands[b].name)}` : `The center`;
    body.innerHTML = `<div class="walk">
      <div class="wnav"><button id="wOut" ${p===0?"disabled":""}>← Outward</button><span class="where">${where}</span><button id="wIn" ${p===NP?"disabled":""}>Inward →</button></div>
      ${card}
      <div class="wnav2"><button id="wStart">Start at the edge</button><button id="wCtr">Go to the center</button><button id="wAuto">${autoT?"Stop":"Auto-walk"}</button></div>
      <p class="hint">Use the arrow keys, or tap any arc.</p></div>`;
    body.querySelector("#wOut").onclick = () => go(p-1);
    body.querySelector("#wIn").onclick = () => go(p+1);
    body.querySelector("#wStart").onclick = () => go(0);
    body.querySelector("#wCtr").onclick = () => go(NP);
    body.querySelector("#wAuto").onclick = () => { if(autoT) stopAuto(); else { autoT = setInterval(()=>{ if(st.pair>=NP) stopAuto(); else go(st.pair+1); }, 6000); } render(); };
    history.replaceState(null, "", "#/chiasm/" + (p<NP ? P[p].label : ""));
  } else {
    let h = "";
    for(let p=0;p<NP;p++){
      const x = P[p], sh = new Set([...words(x.L.text)].filter(w=>words(x.R.text).has(w))), b = st.bandOf(p);
      const depth = Math.min(p, 40);
      if(p===0 || st.bandOf(p-1)!==b) h += `<div class="fband" data-b="${b}">Band ${b+1} · ${esc(data.bands[b].name)}</div>`;
      h += `<div class="frow${p===st.pair?" sel":""}${st.band!=null&&b!==st.band?" dim":""}" data-p="${p}" data-b="${b}" style="--d:${depth}">
        <div class="half"><span class="lab">${esc(x.label)}</span> <span class="ref">${esc(x.L.ref)}${srcTag(x.L)}</span><p>${mark(x.L.text,sh,st.shared)}</p></div>
        <div class="hinge" aria-hidden="true"></div>
        <div class="half"><span class="lab">${esc(x.label)}′</span> <span class="ref">${esc(x.R.ref)}${srcTag(x.R)}</span><p>${mark(x.R.text,sh,st.shared)}</p></div></div>`;
    }
    const c = data.center;
    h += `<div class="frow ctrrow${st.pair===NP?" sel":""}" data-p="${NP}" style="--d:40"><div class="half"><span class="lab">${esc(c.label)} · the center</span> <span class="ref">${esc(c.ref)} <span class="jst">JST</span></span><p>${esc(c.text)}</p></div></div>`;
    body.innerHTML = `<p class="hint">Read down the left column into the center, then back up the right. Each row is a mirrored pair.</p><div class="fold">${h}</div>`;
    body.querySelectorAll(".frow").forEach(r => r.onclick = () => { st.pair = +r.dataset.p; body.querySelectorAll(".frow").forEach(x=>x.classList.toggle("sel",x===r)); drawArcs(); });
    history.replaceState(null, "", "#/chiasm");
  }
}

function stopAuto(){ if(autoT){ clearInterval(autoT); autoT = null; } }
function teardown(){ stopAuto(); if(keyH) document.removeEventListener("keydown", keyH); window.removeEventListener("resize", drawArcs); keyH = null; st = null; }

return {mount, teardown};
})();
