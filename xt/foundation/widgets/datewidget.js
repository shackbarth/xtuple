/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */

enyo.kind({
  name: "DateWidget",
  kind: enyo.Control,
  published: {
    dateObject: null
  },
  components: [
    {
      kind: "onyx.InputDecorator", components: [
        { kind: "onyx.TextArea", placeholder: "Search term", onchange: "doInputChanged" },
        { kind: "Image", src: "images/date-icon.jpg", ontap: "doIconTapped"}
      ]
    }
  ],
  doInputChanged: function () {
    console.log("input changed");
  },
  doIconTapped: function () {
    console.log("icon tapped");

  }
});
