/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true, onyx */

(function () {

  /**
    @name XV.Groupbox
    @class Provides a container in which its components are
    a vertically stacked column of horizontal rows.<br />
    Includes a header.<br />
    To implement a groupbox with a scroller, see {@link XV.ScrollableGroupbox}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.
    @extends enyo.FittableRows
   */
  XV.GroupboxHeader = onyx.GroupboxHeader;
  XV.Groupbox = enyo.FittableRows;

  enyo.kind(/** @lends XV.ScrollableGroupbox# */{
    name: "XV.ScrollableGroupbox",
    kind: "Scroller",
    horizontal: "hidden",
    classes: "xv-scroller",
    touch: true,
    fit: true
  });
}());
