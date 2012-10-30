/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    Implements an onyx.TextArea with API support from XV.Input

    @class
    @name XV.TextArea
    @extends XV.Input
   */
  enyo.kind(/** @lends XV.TextArea# */{
    name: "XV.TextArea",
    kind: "XV.Input",
    classes: "xv-textarea",
    published: {
      attr: null,
      placeholder: ""
    },
    components: [
      {name: "input", kind: "onyx.TextArea", classes: "xv-textarea-input",
        onchange: "inputChanged", onkeydown: "keyDown"}
    ],
    keyDown: function (inSender, inEvent) {
      // XXX hack here (and in other places that reference issue 18397)
      // can be removed once enyo fixes ENYO-1104
      var shadowNone = inEvent.originator.hasClass("text-shadow-none");
      inEvent.originator.addRemoveClass("text-shadow-none", !shadowNone);
      inEvent.originator.addRemoveClass("text-shadow-0", shadowNone);
      // end hack
    },
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    }
  });

}());
