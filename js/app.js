/* Apocalyptic Poetry site: tiny hash router. Works on GitHub Pages and from a local file. */
(function(){
const D = window.SITE_DATA, C = D.catalog;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const app = $("#app");

/* starfield, drawn once */
(function stars(){
  const n = 160, w = 1600, h = 1000; let s = "";
  let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for(let i=0;i<n;i++){ const x=r()*w,y=r()*h,a=.15+r()*.55,rad=r()<.08?1.4:.7;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad}" fill="rgba(220,228,240,${a.toFixed(2)})"/>`; }
  $("#stars").innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${s}</svg>`;
})();

function crumbs(list){
  $("#crumbs").innerHTML = list.map((c,i) => i<list.length-1 ? `<a href="#/${c[1]}">${esc(c[0])}</a>` : `<span>${esc(c[0])}</span>`).join('<span class="sep">/</span>');
}
function itemsHTML(items){
  return `<ul class="items">${items.map(it => it.status==="soon"
    ? `<li><span class="soon">${esc(it.title)}</span></li>`
    : `<li><a href="#/${it.route}">${esc(it.title)}${it.note?`<small>${esc(it.note)}</small>`:""}</a></li>`).join("")}</ul>`;
}

function home(){
  crumbs([]);
  document.title = "Apocalyptic Poetry · Hyrum W. Hawks";
  app.innerHTML = `
  <section class="hero"><div class="spiral-wrap" title="The border is Revelation 12 in Greek, in Joseph Smith Translation order, spiraling in from 12:11.">${D.spiralSVG}</div>
    <div class="hero-in"><h1>Apocalyptic Poetry</h1>
      <a class="by" href="${C.authorLink}" target="_blank" rel="noopener">Hyrum W. Hawks</a>
      <a class="logo" href="${C.authorLink}" target="_blank" rel="noopener"><img src="assets/img/emblem.png" alt="Hyrum W. Hawks"></a></div>
    <nav class="doors">${C.sections.map((s,i) => `<a class="door d${i+1}" href="#/section/${s.id}"><span class="dt">${esc(s.title)}</span>${s.byline?`<span class="db">${esc(s.byline)}</span>`:""}</a>`).join("")}</nav>
  </section>`;
}

function setTheme(s){ document.body.className = s && s.theme ? "theme-" + s.theme : ""; }
const FRAMES = { hebrew: () => D.spiralHebrewSVG, greek: () => D.spiralSVG };
const FRAME_NOTE = { hebrew: "The border is Genesis 1 in paleo-Hebrew letters (Westminster Leningrad Codex consonants), read right to left, spiraling in from 1:1.",
                     greek: "The border is Revelation 12 in Greek, in Joseph Smith Translation order, spiraling in from 12:11." };
function section(id){
  const s = C.sections.find(x => x.id===id); if(!s) return notFound();
  crumbs([["Home",""],[s.title,""]]);
  document.title = s.title + " · Hyrum W. Hawks";
  setTheme(s);
  if(s.frame){
    app.innerHTML = `<section class="hero framed"><div class="spiral-wrap" title="${esc(FRAME_NOTE[s.frame])}">${FRAMES[s.frame]()}</div>
      <div class="hero-in frame-in">${s.byline?`<p class="eyebrow">${esc(s.byline)}</p>`:""}<h1>${esc(s.title)}</h1>
      ${s.groups.map(g => `<div class="grp">${g.title?`<h3>${esc(g.title)}</h3>`:""}${itemsHTML(g.items)}</div>`).join("")}</div></section>`;
    return;
  }
  app.innerHTML = `<div class="list-page"><p class="eyebrow">${esc(s.byline)}</p><h1>${esc(s.title)}</h1>${s.blurb?`<p class="lede">${esc(s.blurb)}</p>`:""}
   ${s.groups.map(g => `<div class="grp">${g.title?`<h3>${esc(g.title)}</h3>`:""}${itemsHTML(g.items)}</div>`).join("")}</div>`;
}

function sectionOf(route){
  for(const s of C.sections) for(const g of s.groups) for(const it of g.items) if(it.route===route) return s;
  return null;
}
const ORN = `<svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><path d="M0 6H48M72 6H120" stroke="#6cb4ee" stroke-width="1"/><circle cx="60" cy="6" r="3" fill="#ffa94d"/><circle cx="52" cy="6" r="1.3" fill="#6cb4ee"/><circle cx="68" cy="6" r="1.3" fill="#6cb4ee"/></svg>`;

function poem(id){
  const P = (D.poems||{})[id]; if(!P) return notFound();
  const s = sectionOf("poem/"+id);
  setTheme(s);
  crumbs([["Home",""], s?[s.title,"section/"+s.id]:["Poems",""], [P.title,""]]);
  document.title = P.title + " · Hyrum W. Hawks";
  const head = `<div class="poem-head"><p class="eyebrow">${esc(P.eyebrow||(P.kind==="hymns"?"Hymns":"Poem"))}</p><h1>${esc(P.title)}</h1>${P.subtitle?`<p class="subtitle">${esc(P.subtitle)}</p>`:""}${P.author||P.source?`<div class="by">`:""}${esc(P.author)}${P.source?`<a class="star" href="javascript:void 0" data-jump="src" aria-label="Source note">*</a>`:""}${P.author||P.source?`</div>`:""}${P.intro?`<p class="intro">${esc(P.intro)}</p>`:""}</div>`;
  if(P.kind==="hymns"){
    app.innerHTML = `<article class="poem">${head}
      <nav class="toc">${P.sections.map(x=>`<a href="#/poem/${id}/${x.n}">${x.n}. ${esc(x.title)}</a>`).join("")}</nav>
      ${P.sections.map(x=>`<section class="hymn" id="h${x.n}"><h2><span class="num">${x.n}</span>${esc(x.title)}</h2>${x.lines.map(l=>`<p>${esc(l)}</p>`).join("")}</section>${ORN}`).join("")}
      ${sourceHTML(P)}</article>`;
  } else if(P.kind==="verses"){
    app.innerHTML = `<article class="poem gen">${head}
      ${P.verses.map(v => v[0] ? `<p class="vs"><span class="vn">${esc(v[0])}</span>${esc(v[1])}</p>${/were the \w+ day\.$/.test(v[1])?ORN:""}`
                                : `<p class="vs gap">${esc(v[1])}</p>`).join("")}
      ${sourceHTML(P)}</article>`;
  } else if(P.kind==="structure"){
    app.innerHTML = `<article class="poem">${head}
      <div class="struct">${P.lines.map(l=>`<p class="sl" style="--i:${l[1]}"><span class="sk">${esc(l[0])}</span>${esc(l[2])}</p>`).join("")}</div>
      ${P.ref?`<p class="sref">${esc(P.ref)}</p>`:""}${P.afterword?`<p class="afterword">${esc(P.afterword)}</p>`:""}${sourceHTML(P)}</article>`;
  } else if(P.kind==="two-voice"){
    app.innerHTML = `<article class="poem" id="tv">${head}
      <div class="voices"><button class="on" data-v="">Both voices</button><button data-v="only-b">Blessings</button><button data-v="only-c">Consequences</button></div>
      ${P.stanzas.map(st=>{const [b,c]=st.title.replace(/^Beatitude of /,"").split(/ vs /i);
        return `<section class="stanza"><h2>${esc(st.title)}</h2><div class="pairnames"><span class="b">${esc(b||"")}</span> · <span class="c">${esc(c||"")}</span></div>
        ${st.lines.map((l,i)=>`<p class="vl ${i%2?"c":"b"}">${esc(l)}</p>`).join("")}</section>`;}).join(ORN)}
      ${sourceHTML(P)}</article>`;
    const tv = $("#tv");
    tv.querySelectorAll(".voices button").forEach(b => b.onclick = () => {
      tv.classList.remove("only-b","only-c"); if(b.dataset.v) tv.classList.add(b.dataset.v);
      tv.querySelectorAll(".voices button").forEach(x=>x.classList.toggle("on",x===b)); });
  }
  wireJumps();
}

function sourceHTML(P){
  if(!P.source) return "";
  return `<aside class="srcnote" id="src"><p><span class="star">*</span> ${esc(P.source.note)}</p>
    ${P.source.verses?`<ul>${P.source.verses.map(v=>`<li><b>${esc(v[0])}:</b> Revelation ${esc(v[1])}</li>`).join("")}</ul>`:""}
    <p class="back"><a href="javascript:void 0" data-jump="top">Back to the top</a></p></aside>`;
}
function wireJumps(){
  app.querySelectorAll("[data-jump]").forEach(a => a.onclick = e => { e.preventDefault();
    if(a.dataset.jump==="top") window.scrollTo({top:0,behavior:"smooth"});
    else { const el=document.getElementById(a.dataset.jump); if(el) el.scrollIntoView({behavior:"smooth"}); } });
}
function notFound(){ crumbs([["Home",""],["Not found",""]]); app.innerHTML = `<h1>Not found</h1><p class="lede"><a href="#/">Return home</a></p>`; }

function route(){
  const h = location.hash.replace(/^#\/?/,"").split("/").filter(Boolean);
  window.scrollTo(0,0);
  if(window.Chiasm) Chiasm.teardown();
  document.body.className = "";
  if(!h.length) home();
  else if(h[0]==="section") section(h[1]);
  else if(h[0]==="poem"){ poem(h[1]); if(h[2]){ const el=document.getElementById("h"+h[2]); if(el) el.scrollIntoView(); } }
  else if(h[0]==="chiasm"){ const s=sectionOf("chiasm"); crumbs([["Home",""],[s.title,"section/"+s.id],["The 70-Fold Chiasm",""]]);
    document.title = "The 70-Fold Chiasm of Revelation · Hyrum W. Hawks"; Chiasm.mount(app, D.chiasm70, h[1]); }
  else notFound();
  app.focus({preventScroll:true});
}
window.addEventListener("hashchange", route);
route();
})();
