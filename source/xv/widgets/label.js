/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {
  "use strict";

  /**
    Implement the setValue method, which is necessary for all
    widgets in the `XV.Workspace`.
  */
  enyo.kind({
    name: "XV.Label",
    kind: "enyo.Control",
    style: "border: 0px;", // TODO: make this an overridable default
    components: [
      { tag: "span", name: "field", style: "border: 0px; "}
    ],
    setValue: function (value) {
      this.$.field.setContent(value);
    }
  });
  
}());
