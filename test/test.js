#!/usr/bin/env node

require("../xt");

//XT.setup({
//  autoStart: true,
//  version: "beta1",
//  requireDatabase: true,
//  requireServer: true
//});


var b = XT.Object.create({
  some1: function () {
    console.log("some1");
  }.observes("something")
});

b.emit("something");

var c = XT.Object.extend({
  some2: function () {
    console.log("some2");
  }.observes("something")
});

var d = c.create();
d.set("something", true);