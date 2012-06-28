#!/usr/bin/env node

// native
_fs             = require("fs");
_path           = require("path");
_util           = require("util");

// third-party
Backbone            = require("backbone");
BackboneRelational  = require("backbone-relational");
vows                = require("vows");
_                   = require("underscore");
io                  = require("socket.io-client");

//......................................
// INCLUDE ALL THE NECESSARY XT FRAMEWORK
// DEPENDENCIES
[
  "foundation",
  "datasource",
  "math",
  "request",
  "response",
  "session",
  "locale",
  "ext/proto/string",
  "ext/string",
  "ext/model",
  "ext/collection",
  "ext/startup_task",
  "en/strings"
].map(function(path) {
  return _path.join(__dirname, "../xt/foundation", path) + ".js";
}).forEach(function(path) {
  require(path);
});
//......................................
// INCLUDE ALL THE NECESSARY XM FRAMEWORK
// DEPENDENCIES
//
// HANEOUS ABOMINATION TO KEEP BACKBONE-
// RELATIONAL FROM BOMBING...
Backbone.XM = XM;
// LOAD ALL MODELS
//
// TO PRESERVE LOAD ORDER WE HACK THIS INTO
// UGLY OBLIVION BUT BY GOLLY IT F*@&$@# WORKS
require("./lib/fake_enyo");
// GRAB THE LOAD ORDER WE WANT TO PRESERVE
// FROM THE package.js FILE IN MODELS
require(_path.join(__dirname, "../xm/models", "package.js"));
// GRAB THE CRM MODULE
require(_path.join(__dirname, "../xm/modules", "crm.js"));
// GRAB THE STARTUP TASKS
require(_path.join(__dirname, "../xm", "startup.js"));

//console.log(_util.inspect(XT.getStartupManager().get("tasks")));
//console.log(_util.inspect(Backbone));
//console.log(_util.inspect(XT.Model));
//console.log(_util.inspect(XT));
//console.log(_util.inspect(XM));

XT.dataSource.connect();

var timer = setInterval(function() {
  if (XT.dataSource.isConnected) {
    clearInterval(timer);
    XT.session.acquireSession({
      username: "admin",
      password: "Assemble!Aurora",
      organization: "aurora"
    }, function(result) {
      console.log(result);
    });
  }
}, 1000);


