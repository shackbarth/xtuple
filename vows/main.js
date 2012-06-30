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
program             = require("commander");
/*tinycolor*/         require("tinycolor");

//......................................
// COMMAND LINE PARSING
(function() {
  var tests = function(val) {
    return val.split(" ").map(String);
  };
  program
    .option("--spec", "Use the spec reporter")
    .option("-t, --tests [tests]", "Specify space-separated string of test names", tests, ["*"])
    .option("-u, --user [user]", "The database user", "admin")
    .option("-p, --password [password]", "The database user's password", "Assemble!Aurora")
    .option("-o, --organization [organization]", "The database user's organization", "aurora")
    .option("-h, --host [host]", "The datasource hostname/url/ip", "asteroidbelt.xtuple.com")
    .option("-P, --port [port]", "The datasource port", 9000, parseInt)
    .parse(process.argv);
  if (program.spec) {
    var spec = require(_path.join(__dirname, "node_modules/vows/lib/vows/reporters/spec"));
    var suite = require(_path.join(__dirname, "node_modules/vows/lib/vows/suite")).Suite.prototype;
    suite.ext_run = suite.run;
    suite.run = function() {
      return suite.ext_run.call(this, {reporter:spec});
    };
  }
})();
//......................................
// XVOWS IS THE GLOBAL NAMESPACE AVAILABLE
// FOR SHARING VOWS SPECIFIC INFORMATION
// AND FUNCTIONALITY
XVOWS = {};
// PROCESS ANY INCOMING ARGS REAL QUICK
(function() {
  XVOWS.args = program.tests;
  XVOWS.console = function() {
    var args = XT.$A(arguments);
    args.unshift("[XVOWS] ".yellow);
    console.log.apply(console, args);
    XVOWS.log(args);
  };
})();
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
(function() {
  XVOWS.log = XT.log = function() {
    var out = XT.$A(arguments).map(function(arg) {
      return typeof arg === "string"? arg: _util.inspect(arg,true,3);
    }).join('\n');
    if (XVOWS.outfile && XVOWS.outfile.writable) {
      XVOWS.outfile.write("%@\n".f(out), "utf8");
    } else {
      XVOWS.outfile = _fs.createWriteStream(_path.join(__dirname, "run.log"), {
        flags: "w",
        encoding: "utf8"
      });
      XVOWS.outfile.on("error", function(err) {
        throw err;
      });
      XVOWS.outfile.write("\n[ENTRY] started %@\n".f((new Date()).toLocaleString()));
      // write the first output that caused this to open
      // the stream to begin with
      XVOWS.outfile.write("%@\n".f(out));
    }
  };
  
  // make sure on process SIGINT that we catch it and
  // properly close the pipe
  process.on("SIGINT", function() {
    console.log("\n"); // to clear the line
    XVOWS.console("caught SIGINT waiting for logfile to drain");
    XVOWS.outfile.on("close", function() {
      XVOWS.console("all done, see ya");
      process.exit(0);
    });
    XVOWS.outfile.destroySoon();
  });
})();
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
    XVOWS.console("session acquired, starting tasks");
    XT.getStartupManager().registerCallback(XVOWS.begin);
    XT.getStartupManager().start();
  };
  
  XVOWS.console("connecting to the datasource");
  XT.dataSource.datasourceUrl = program.host;
  XT.dataSource.datasourcePort = program.port;
  XT.dataSource.connect(function() {
    XT.session.acquireSession({
      username: program.user,
      password: program.password,
      organization: program.organization
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
  XVOWS.console("all startup tasks completed");
  XVOWS.console("searching for available tests");
  
  XVOWS.findAllTests();
  
  XVOWS.console("found %@ total".f((Object.keys(XVOWS.tests)).length));
  
  // were there special requests from the command line
  
  if (XVOWS.args.length === 1 && XVOWS.args[0] === "*") {
    // running all available tests
  } else if (XVOWS.args.length >= 1) {
    XVOWS.args.map(function(file) {
      return _path.extname(file) === ".js"? file: file + ".js";
    }).forEach(function(file) {
      XVOWS.addTest(file);
    });
  } else { 
    throw new Error("cannot figure out what to do"); 
  }
  
  // start testing
  XVOWS.start();
};

XVOWS.addTest = function(file) {
  if (!this.toRun) this.toRun = [];
  this.toRun.push(file);
};

XVOWS.start = function() {
  
  if (this.isStarted) {
    return false;
  }
  
  XVOWS.console("starting tests");
  
  this.isStarted = true;
  
  var run = this.toRun || [];
  var tests = this.tests;
  var testNames = Object.keys(tests);
  var len = testNames.length;
  
  if (run.length <= 0) {
    if (len > 0) {
      
      XVOWS.console("running all tests");
      
      this.toRun = run = testNames;
    } else { 
      
      XVOWS.console("no tests to run");
      
      return this.finish(); 
    }
  } else {
    XVOWS.console("running %@ tests".f(run.length));
  }

  this.next();
};

XVOWS.finish = function() {
  XVOWS.console("testing finished");
  process.emit("SIGINT"); // let the log cleanup
};

XVOWS.next = function() {
  var run = this.toRun;
  var tests = this.tests;
  var running;
  
  if (!run || run.length <= 0) {
    return this.finish();
  }
  
  if (this.running) {
    console.log("\n"); // to break it up some
    XVOWS.console("finished running %@".f(this.running).red);
    this.running = null;
  }
  
  while(true && run.length > 0) {
    running = run.shift();
    if (!running || !tests[running]) {
      XVOWS.console("could not run test %@, skipping".f(running));
    } else {
      this.running = running;
      console.log("\n"); // to break it up some
      XVOWS.console("running %@\n".f(running).red);
      running = tests[running];
      break;
    }
  }
  
  require(running);
};
