/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

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
  enyo.kind(/** @lends XV.Groupbox# */{
    name: "XV.Groupbox",
    kind: "FittableRows",
    classes: "xv-groupbox",
    published: {
      title: "_overview".loc()
    }
  });

  /**
    @name XV.ScrollableGroupbox
    @class Provides a container in which its components are 
    a vertically stacked column of horizontal rows.<br /> 
    Includes a header and a scroller.<br />
    To implement a groupbox without a scroller, see {@link XV.Groupbox}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Scroller">enyo.Scroller</a>. 
    @extends enyo.Scroller
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
