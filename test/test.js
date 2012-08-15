#!/usr/bin/env node

require("../xt");

//X.setup({
//  autoStart: true,
//  version: "beta1",
//  requireDatabase: true,
//  requireServer: true
//});


var b = X.Object.create({
  some1: function () {
    console.log("some1");
  }.observes("something")
});

b.emit("something");

var c = X.Object.extend({
  some2: function () {
    console.log("some2");
  }.observes("something")
});

var d = c.create({
  some2: function () {
    console.log("somenew2");
    this._super.some2();
  }.observes("something")
});
d.set("something", true);
