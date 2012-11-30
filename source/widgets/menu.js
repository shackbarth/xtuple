/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
	@name XV.MenuItem
    @class A button styled to look like a menu item, intended for use in an onyx.Menu.<br />
    For example, see the popup menu in {@link XV.RelationWidget}.<br />
    Derived from <a href="http://enyojs.com/api/#onyx.MenuItem">onyx.MenuItem</a>.    
    @extends onyx.MenuItem
   */
  enyo.kind(/** @lends XV.MenuItem# */{
    name: "XV.MenuItem",
    kind: "onyx.MenuItem",
    classes: "xv-menuitem",
    published: {
      disabled: false
    },
    /**
    @todo Document the disabledChanged method.
    */
    disabledChanged: function () {
      this.addRemoveClass("disabled", this.disabled);
    },
    /**
    @todo Document the tap method.
    */
    tap: function (inSender) {
      if (!this.disabled) { return this.inherited(arguments); }
    }
  });

}());
