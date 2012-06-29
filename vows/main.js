#!/usr/bin/env node

// native
_fs             = require("fs");
_path           = require("path");
_util           = require("util");

// third-party
Backbone            = require("backbone");
BackboneRelational  = require("backbone-relational");
vows                = require("vows");
assert              = require("assert");
_                   = require("underscore");
io                  = require("socket.io-client");

//......................................
// XVOWS IS THE GLOBAL NAMESPACE AVAILABLE
// FOR SHARING VOWS SPECIFIC INFORMATION
// AND FUNCTIONALITY
XVOWS = {};
// PROCESS ANY INCOMING ARGS REAL QUICK
(function(args) {
  XVOWS.args = args.slice(2);
})(process.argv);
//......................................
// INCLUDE ALL THE NECESSARY XT FRAMEWORK
// DEPENDENCIES
[
  "foundation",
  "log",
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
// CRUSH QUIET SMASH AND DESTROY ANY NORMAL OUTPUT FOR NOW
// ...actually just...pipe it to some file...
XVOWS.log = XT.log = function() {
  var out = XT.$A(arguments).map(function(arg) {
    return typeof arg === "string"? arg: _util.inspect(arg,true,3);
  }).join('\n');
  if (XVOWS.outfile && XVOWS.outfile.writable) {
    XVOWS.outfile.write("%@\n".f(out), "utf8");
  } else {
    XVOWS.outfile = _fs.createWriteStream(_path.join(__dirname, "run.log"), {
      flags: "a",
      encoding: "utf8"
    });
    XVOWS.outfile.on("error", function(err) {
      throw err;
    });
    XVOWS.outfile.write("\n[ENTRY] started %@\n".f((new Date()).toLocaleString()));
  }
};
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

(function(){
  // for when a session is retrieved or needs to be
  // selected and completes...
  var selectionDone = function() {
    // register a callback for when startup tasks are
    // completed
    console.log("selectionDone(): ");
    XT.getStartupManager().registerCallback(XVOWS.begin);
    XT.getStartupManager().start();
  };
  
  XT.dataSource.connect(function() {
    XT.session.acquireSession({
      username: "admin",
      password: "Assemble!Aurora",
      organization: "aurora"
    }, function(result) {
      if (result.code === 1) {
        // force new session, always
        XT.session.selectSession("FORCE_NEW_SESSION", selectionDone);
      } else if (result.code === 4) {
        // we're ok? not sure how but, whatever...
        selectionDone();
      } else {
        throw new Error("could not acquire valid session");
      }
    });
  });
})();

XVOWS.findAllTests = function() {
  var path = _path.join(__dirname, "tests");
  var tests = XVOWS.tests = {};
  _fs.readdirSync(path).filter(function(file) {
    return _path.extname(file) === ".js"? true: false;
  }).forEach(function(file) {
    tests[file] = _path.join(__dirname, "tests", file);
  });
};

XVOWS.begin = function() {
  XVOWS.findAllTests();
  
  // were there special requests from the command line
  if (XVOWS.args.length > 0) {
    XVOWS.args.map(function(file) {
      return _path.extname(file) === ".js"? file: file + ".js";
    }).forEach(function(file) {
      if (XVOWS.tests[file]) {
        require(XVOWS.tests[file]);
      } else { console.warn("could not find requested test " + file); }
    });
  } else {
    // nothing special, run them all!
    for (var test in XVOWS.tests) {
      if (XVOWS.tests.hasOwnProperty(test)) {
        require(XVOWS.tests[test]);
      }
    }
  }
};