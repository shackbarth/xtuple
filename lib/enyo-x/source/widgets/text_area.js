/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.TextArea
    @class Implements an onyx.TextArea with API support from XV.Input.
    Use to implement a multi-line input box.<br />
    Creates an HTML textarea element.<br />
    For example, used as a component of {@link XV.CommentBoxItem}.
    @extends XV.Input
  */
  enyo.kind(
    /** @lends XV.TextArea# */{
    name: "XV.TextArea",
    kind: "XV.InputWidget",
    classes: "xv-textarea",
    published: {
      attr: null,
      showLabel: false
    },
    components: [
      {name: "label", classes: "xv-label"},
      {name: "input", kind: "onyx.TextArea", classes: "xv-textarea-input",
        onchange: "inputChanged", onkeydown: "keyDown"}
    ]
  });

}());
