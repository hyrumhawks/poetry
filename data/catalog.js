/* The menu. Add a poem: put its data file in data/poems/, add a <script> line in index.html,
   and add an entry here. status "soon" shows the title greyed out. */
window.SITE_DATA = window.SITE_DATA || {};
SITE_DATA.catalog = {
  siteTitle: "Apocalyptic Poetry",
  author: "Hyrum W. Hawks",
  authorLink: "https://linktr.ee/hyrumhawks",
  sections: [
    {
      id: "hawks",
      title: "Apocalypse-Inspired Poetry",
      byline: "by Hyrum W. Hawks",
      blurb: "",
      groups: [
        { title: null, items: [
          { id: "praise-of-john", title: "The Praise of John the Revelator", note: "Nine hymns", route: "poem/praise-of-john" },
          { id: "creation-of-the-children-of-god", title: "The Creation of the Children of God", note: "Alternate Genesis 1:1 to 2:25", route: "poem/creation-of-the-children-of-god" },
          { id: "beatitudes-vs-consequences", title: "Beatitudes vs Consequences in the Apocalypse of John the Revelator", note: "Seven paired stanzas", route: "poem/beatitudes-vs-consequences" },
          { title: "And the rest…", status: "soon" }
        ]}
      ]
    },
    {
      id: "john",
      title: "The Poetry of John's Apocalypse",
      byline: "",
      blurb: "",
      groups: [
        { title: "Chiasm", items: [
          { id: "chiasm70", title: "The 70-Fold Chiasm", note: "70 mirrored pairs around 12:11", route: "chiasm" },
          { id: "rev-7-13-14", title: "Dedicated to the Lamb", note: "Revelation 7:13–14", route: "poem/rev-7-13-14" },
          { title: "The Septet of Septets", status: "soon" }
        ]},
        { title: "Parallelism", items: [ { id: "lamb-overcomes-dragon", title: "The Lamb Overcomes the Dragon", note: "JST Revelation 12:6–11 and Revelation 20:1–6", route: "poem/lamb-overcomes-dragon" }, { id: "cast-down-vs-enthroned", title: "Cast Down vs Enthroned", note: "Revelation 20:1–15", route: "poem/cast-down-vs-enthroned" } ] },
        { title: "The Rest", items: [ { id: "new-jerusalem-wendland", title: "Seven Revelations Concerning the New Jerusalem", note: "Revelation 21:1–22:5 · compiled by Ernst R. Wendland", route: "poem/new-jerusalem-wendland" } ] }
      ]
    },
    {
      id: "more",
      theme: "tan",        /* tan pages */
      frame: "hebrew",     /* paleo-Hebrew Genesis 1 spiral border */
      title: "Ezekiel, Daniel, and Other Ancient Prophets",
      byline: "",
      blurb: "",
      groups: [ { title: null, items: [ { title: "Coming", status: "soon" } ] } ]
    },
    {
      id: "stats",
      title: "Data Analysis: Statistics and Other Nerdery",
      byline: "",
      blurb: "",
      groups: [ { title: null, items: [ { title: "Coming", status: "soon" } ] } ]
    }
  ]
};
