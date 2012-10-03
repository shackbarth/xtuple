/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  /**
    The groupbox holds the widgets in each panel of the workspace.

    @class
    @alias XV.Groupbox
    @see XV.ScrollableGroupbox
   */
  var groupBox = {
    name: "XV.Groupbox",
    kind: "FittableRows",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  };
  enyo.kind(groupBox);

  /**
    A variant of the groupbox that automatically includes a scroller

    @class
    @alias XV.ScrollableGroupbox
    @see XV.Groupbox
   */
  var scrollableGroupbox = {
    name: "XV.ScrollableGroupbox",
    kind: "Scroller",
    horizontal: "hidden",
    classes: "xv-groupbox xv-scroller",
    published: {
      title: "_overview".loc()
    }
  };
  enyo.kind(scrollableGroupbox);

}());
