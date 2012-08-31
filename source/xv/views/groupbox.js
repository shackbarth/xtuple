/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  
  enyo.kind({
    name: "XV.Panel",
    kind: "FittableRows",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  });

  enyo.kind({
    name: "XV.ScrollableGroupbox",
    kind: "Scroller",
    horizontal: "hidden",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  });

}());
