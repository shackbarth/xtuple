var depends = (typeof enyo !== 'undefined') ? enyo.depends : X.depends;
depends(
  "backbone/backbone.js",
  "Backbone-relational/backbone-relational.js",
  "JSON-Patch/src/json-patch-duplex.js"
);
