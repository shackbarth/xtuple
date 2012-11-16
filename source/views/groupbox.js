/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  /**
    @class The groupbox holds the widgets in each panel of the workspace.
    @name XV.Groupbox
    @see XV.ScrollableGroupbox
   */
  enyo.kind(/** @lends XV.Groupbox# */{
    name: "XV.Groupbox",
    kind: "FittableRows",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  });

  /**
    @class A variant of the groupbox that automatically includes a scroller.
    @name XV.ScrollableGroupbox
    @see XV.Groupbox
   */
  enyo.kind(/** @lends XV.ScrollableGroupbox# */{
    name: "XV.ScrollableGroupbox",
    kind: "Scroller",
    horizontal: "hidden",
    classes: "xv-groupbox xv-scroller",
    published: {
      title: "_overview".loc()
    }
  });

}());
