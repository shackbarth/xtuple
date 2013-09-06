/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {

  /**
    @name XV.Scroller
    @class Provides a viewport in which the user may scroll content using touch or mouse actions.
    Styled with our css.<br />
    For example, used as a component in {@link XV.CommentBox}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Scroller">enyo.Scroller</a>.
    @extends enyo.Scroller
   */
  enyo.kind(
    /** @lends XV.Scroller# */{
    name: "XV.Scroller",
    kind: "Scroller",
    classes: "xv-scroller"
  });

}());
