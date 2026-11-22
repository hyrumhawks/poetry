# Apocalyptic Poetry · Hyrum W. Hawks

A static website (HTML, CSS, JavaScript). No build step is needed to view it: open `index.html`.

## Layout
- `index.html`: the page shell. One `<script>` line per data file.
- `data/catalog.js`: the menus. Add or rename poems here.
- `data/poems/*.js`: one file per poem.
- `data/chiasm70.js`: the 70-fold chiasm (revised set, Nov 1, 2026, from `pairs70()` in `Revelation Structure Research\Nov 2026 research\work\fold\src\textmodel.py`).
- `data/spiral-hebrew.js`: the paleo-Hebrew spiral of Genesis 1 (consonants of the Westminster Leningrad Codex, openscriptures/morphhb `wlc/Gen.xml`, public domain; letters mapped to Unicode Phoenician; font Noto Sans Phoenician, SIL OFL, in `assets/fonts/`). Used on the tan Ezekiel, Daniel, and Others page.
- `data/spiral.js`: the Greek spiral of JST Revelation 12 (from the Oct 28 deck build).
- `js/app.js`: menus and poem pages. `js/chiasm.js`: the chiasm viewer.
- `css/`: style. `assets/`: fonts (Jost, Crimson Pro, GFS Didot) and logos.
- `tools/build_offline.py`: makes the single offline file in `dist/`.

## Where things came from
- Praise of John: `Hymns\Praise\Revelation_Hymns_of_Praise.docx`
- Beatitudes vs Consequences: `Hymns\Beatitudes vs Consequences in the Apocalypse of John the Revelator.docx`
- Chiasm text: `chi\chiasm.json`; 18:2 (AH′), 20:4 (T.1′) and 20:2–3 (T.2′) filled from the KJV in `Reference Library\JSON\Scriptures\new-testament.json`.
