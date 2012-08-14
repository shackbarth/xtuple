/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  enyo.kind({
    name: "XV.WorkspaceBox",
    kind: "Scroller",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  });

}());
