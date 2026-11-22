"""Build one self-contained .html (fonts, images, data, code inside) for email or USB.
Run from the Website folder:  python3 tools/build_offline.py
Output: dist/Apocalyptic Poetry - Hyrum W. Hawks (offline).html"""
import base64, os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(root, p), encoding="utf-8").read()
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode(open(os.path.join(root, p), "rb").read()).decode()
html = rd("index.html")
def css(m):
    path = m.group(1); txt = rd(path); base = os.path.dirname(path)
    txt = re.sub(r"url\((\.\./assets/fonts/[^)]+)\)", lambda u: "url(" + b64(os.path.normpath(os.path.join(base, u.group(1))), "font/woff2") + ")", txt)
    return "<style>\n" + txt + "\n</style>"
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', lambda m: "<script>\n" + rd(m.group(1)).replace("</script", "<\\/script") + "\n</script>", html)
for img in ("assets/img/emblem.png", "assets/img/wordmark.png"):
    html = html.replace(img, b64(img, "image/png"))
os.makedirs(os.path.join(root, "dist"), exist_ok=True)
out = os.path.join(root, "dist", "Apocalyptic Poetry - Hyrum W. Hawks (offline).html")
open(out, "w", encoding="utf-8").write(html)
print(out, round(os.path.getsize(out) / 1e6, 2), "MB")
