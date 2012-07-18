/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */
(function () {
  "use strict";

  /**
   * Basically just a label. The only reason we bother to make a separate widget here
   * is so that make sure we implement the setValue method, which is necessary for all
   * widgets in the workspace
   */
  enyo.kind({
    name: "XV.ReadOnlyWidget",
    kind: "enyo.Control",
    style: "border: 0px;", // TODO: make this an overridable default
    components: [
      { tag: "span", name: "field", style: "border: 0px; "}
    ],
    /**
     * Sets the value of the field.
     */
    setValue: function (value) {
      this.$.field.setContent(value);
    }
  });
}());
