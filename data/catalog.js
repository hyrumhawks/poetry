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
          { id: "creation-of-the-children-of-god", title: "The Creation of the Children of God", note: "Genesis 1:1 through 2:25", route: "poem/creation-of-the-children-of-god" },
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
          { title: "The Septet of Septets", status: "soon" }
        ]},
        { title: "Parallelism", items: [ { title: "Coming", status: "soon" } ] },
        { title: "The Rest", items: [ { title: "Coming", status: "soon" } ] }
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
