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
        onchange: "inputChanged"}
    ],
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    }
  });

}());
