/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, X:true, Backbone:true, require:true, DOCUMENT_HOSTNAME:true
_: true, _fs: true, _path: true, _util:true, vows: true, assert:true, io: true, program: true
request: true, process: true, XVOWS: true, ext: true, XM:true, relocate: true, setTimeout: true

*/

(function () {

  // native
  _fs             = X.fs;
  _path           = X.path;
  _util           = X.util;

  // third-party
  vows                = require("vows");
  assert              = require("assert");
  _                   = require("underscore");
  io                  = require("socket.io-client");
  program             = require("commander");
  request             = require("request");
  require("tinycolor"); /*tinycolor*/
  Backbone = require("backbone");
  require("backbone-relational");

  DOCUMENT_HOSTNAME = "";

  //......................................
  // COMMAND LINE PARSING
  (function () {
    "use strict";
    var tests = function (val) {
      return val.split(" ").map(String);
    };
    program
      .option("--spec", "Use the spec reporter")
      .option("-t, --tests [tests]", "Specify space-separated string of test names", tests, ["*"])
      .option("-u, --user [user]", "Global user ID (must be active global user)", "admin@xtuple.com")
      .option("-P, --password [password]", "Global user password", "")
      .option("-H, --host [host]", "Datasource hostname/ip", "localhost")
      .option("-p, --port [port]", "Datasource port", 443, parseInt)
      .option("-o, --organization [organization]", "Organization to run against", "dev")
      .parse(process.argv);
    if (process.argv.length <= 2) {
      program.parse([process.argv[0], process.argv[1], '--help']);
      process.exit(0);
    }
    if (program.spec) {
      var spec = require(_path.join(X.basePath, "node_modules/vows/lib/vows/reporters/spec"));
      var suite = require(_path.join(X.basePath, "node_modules/vows/lib/vows/suite")).Suite.prototype;
      suite.ext_run = suite.run;
      suite.run = function () {
        return suite.ext_run.call(this, {reporter: spec});
      };
    }
  }());

  var sessionCache, userCache, K, sid, k, user, username, organization, details, tmp;

  // COPIED FROM app.js in client application
  var UNINITIALIZED = 0;
  var LOADING_SESSION = 1;
  var LOADING_EXTENSIONS = 2;
  var LOADING_SCHEMA = 3;
  var LOADING_APP_DATA = 4;
  var RUNNING = 5;
  var currentState = LOADING_SESSION;

  // namespace for the test suite
  XVOWS = X.Object.create({
    className: "XVOWS",

    wait: 5000,

    init: function () {
      this.nexted = _.bind(this.next, this, [true]);
    },

    findAllTests: function () {
      "use strict";

      var path = _path.join(X.basePath, "tests"), files, hash = {};
      _.each(X.directoryFiles(path, {fullPath: true, extension: ".js"}), function (file) {
        hash[_path.basename(file)] = file;
      });
      this.set("tests", hash);
    },

    begin: function () {
      var options = {},
        that = this,
        cnt = 0,
        len = 0;

      // This whole startup thing is terrible....
      if (currentState === LOADING_SESSION) {
        // Treating this like other progressive actions because we assume
        // in the future extensions will be loaded from the server
        currentState = LOADING_EXTENSIONS;
        this.console('loading extensions');
        for (var prop in XT.extensions) {
          if (XT.extensions.hasOwnProperty(prop)) {
            ext = XT.extensions[prop];
            for (var extprop in ext) {
              if (ext.hasOwnProperty(extprop) &&
                  typeof ext[extprop] === "function") {
                //XT.log('Installing ' + prop + ' ' + extprop);
                ext[extprop]();
              }
            }
          }
        }
        this.begin();
      } else if (currentState === LOADING_EXTENSIONS) {
        this.console('loading schema');
        options.success = function () {
          that.begin();
        };
        currentState = LOADING_SCHEMA;
        XT.StartupTask.create({
          taskName: "loadSessionSchema",
          task: function () {
            XT.session.loadSessionObjects(XT.session.SCHEMA, options);
          }
        });
      } else if (currentState === LOADING_SCHEMA) {
        this.console('loading app. data');
        currentState = LOADING_APP_DATA;
        // RUN STARTUP TASKS THAT WERE JUST CACHED
        len = XT.StartupTasks.length;
        _.each(XT.StartupTasks, function (task) {
          XT.StartupTask.create(task);
        });
        XT.getStartupManager().registerCallback(function () {
          cnt++;
          if (cnt >= len) { that.begin(); }
        }, true);
      } else {
        this.console("all startup tasks completed");
        this.console("searching for available tests");
        this.findAllTests();
        this.console("found %@ total".f((Object.keys(this.tests)).length));

        // were there special requests from the command line

        if (this.args.length === 1 && this.args[0] === "*") {
          // running all available tests
        } else if (this.args.length >= 1) {
          this.args.map(_.bind(function (file) {
            return _path.extname(file) === ".js" ? file: file + ".js";
          }, this)).forEach(_.bind(function (file) {
            this.addTest(file);
          }, this));
        } else {
          throw new Error("cannot figure out what to do");
        }

        // start testing
        this.start();
      }
    },

    addTest: function (file) {
      "use strict";
      if (!this.toRun) {
        this.toRun = [];
      }
      this.toRun.push(file);
    },

    start: function () {
      "use strict";
      if (this.isStarted) {
        return false;
      }

      this.console("starting tests");

      this.isStarted = true;

      var run = this.toRun || [];
      var tests = this.tests;
      var testNames = Object.keys(tests);
      var len = testNames.length;

      if (run.length <= 0) {
        if (len > 0) {

          this.console("running all tests");

          this.toRun = run = testNames;
        } else {

          this.console("no tests to run");

          return this.finish();
        }
      } else {
        this.console("running %@ tests".f(run.length));
      }

      this.next();
    },


    finish: function () {
      "use strict";
      this.console("testing finished");
      process.emit("SIGINT"); // let the log cleanup
    },

    next: function (waited) {
      "use strict";
      if (!waited) {
        // this is only necessary because of a delay by vows
        // when it finally determines its batch is complete
        // TODO: if it can/does emit an event detectable
        // on completion this should be modified to use that
        // because this is just plain sloppy
        return setTimeout(this.nexted, 300);
      }

      var run = this.toRun, tests = this.tests, running;


      if (this.running) {
        console.log("\r"); // to break it up some
        this.console("finished running %@".f(this.running).red);
        this.running = null;
      }

      if (!run || run.length <= 0) {
        return this.finish();
      }

      while (true && run.length > 0) {
        running = run.shift();
        if (!running || !tests[running]) {
          this.console("could not run test %@, skipping".f(running));
          running = false;
        } else {
          this.running = running;
          console.log("\n"); // to break it up some
          this.console("running %@\n".f(running).red);
          running = tests[running];
          break;
        }
      }

      if (running) {
        require(running);
      } else { this.finish(); }
    },

    nexted: null
  });

  user = program.user;
  organization = program.organization;






  //......................................
  // INCLUDE ALL THE NECESSARY XT FRAMEWORK
  // DEPENDENCIES

  // this will move into node-xt soon
  X.relativeDependsPath = "";
  X.depends = function () {
    var dir = X.relativeDependsPath,
      files = X.$A(arguments),
      pathBeforeRecursion;

    _.each(files, function (file) {
      if (_fs.statSync(_path.join(dir, file)).isDirectory()) {
        pathBeforeRecursion = X.relativeDependsPath;
        X.relativeDependsPath = _path.join(dir, file);
        X.depends("package.js");
        X.relativeDependsPath = pathBeforeRecursion;
      } else {
        require(_path.join(dir, file));
      }
    });
  };
  // end node-xt-bound code

  X.relativeDependsPath = _path.join(X.basePath, "node_modules/tools/source");
  require("tools");

  XT.app = {show: X.$P};

  // suppress normal output and pipe to file
  (function () {
    "use strict";
    XVOWS.log = XT.log = function () {
      var out = XT.$A(arguments).map(function (arg) {
        return typeof arg === "string" ? arg: _util.inspect(arg, true, 3);
      }).join('\n');
      if (XVOWS.outfile && XVOWS.outfile.writable) {
        XVOWS.outfile.write("%@\n".f(out), "utf8");
      } else {
        XVOWS.outfile = _fs.createWriteStream(_path.join(X.basePath, "run.log"), {
          flags: "a",
          encoding: "utf8"
        });
        XVOWS.outfile.on("error", function (err) {
          throw err;
        });
        XVOWS.outfile.write("\n[ENTRY] started %@\n".f((new Date()).toLocaleString()));
        // write the first output that caused this to open
        // the stream to begin with
        XVOWS.outfile.write("%@\n".f(out));
      }
    };

    X.addCleanupTask(function () {
      if (XVOWS.outfile) {
        XVOWS.outfile.destroySoon();
      }
    });
  }());

  //......................................
  // INCLUDE ALL THE NECESSARY XM FRAMEWORK
  // DEPENDENCIES
  //

  // LOAD ALL MODELS
  //
  X.getCookie = function () {
    return X.json(XVOWS.details);
  };


  X.relativeDependsPath = _path.join(X.basePath, "node_modules/backbone-x/source");
  require("backbone-x");

  // GRAB THE LOAD ORDER WE WANT TO PRESERVE
  // FROM THE package.js FILE IN MODELS
  X.relativeDependsPath = _path.join(X.basePath, "../source/models");
  require(_path.join(X.basePath, "../source/models", "package.js"));
  require(_path.join(X.basePath, "../source/ext", "core.js"));
  require(_path.join(X.basePath, "../source/ext", "datasource.js"));
  // GRAB THE CRM MODULE
  require(_path.join(X.basePath, "../../public-extensions/source/crm/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../public-extensions/source/crm/client/models");
  require(_path.join(X.basePath, "../../public-extensions/source/crm/client/models", "package.js"));
  // GRAB THE PROJECT MODULE
  require(_path.join(X.basePath, "../../public-extensions/source/project/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../public-extensions/source/project/client/models");
  require(_path.join(X.basePath, "../../public-extensions/source/project/client/models", "package.js"));
  // GRAB THE CONNECT MODULE
  require(_path.join(X.basePath, "../../private-extensions/source/connect/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../private-extensions/source/connect/client/models");
  require(_path.join(X.basePath, "../../private-extensions/source/connect/client/models", "package.js"));
  // GRAB THE INCIDENT PLUS MODULE
  require(_path.join(X.basePath, "../../public-extensions/source/incident_plus/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../public-extensions/source/incident_plus/client/models");
  require(_path.join(X.basePath, "../../public-extensions/source/incident_plus/client/models", "package.js"));
  // GRAB THE STARTUP TASKS
  require(_path.join(X.basePath, "../source", "startup.js"));

  // HANEOUS ABOMINATION TO KEEP BACKBONE-
  // RELATIONAL FROM BOMBING...
  Backbone.XM = XM;

  require(_path.join(X.basePath, "lib/crud.js"));

  // PROCESS ANY INCOMING ARGS REAL QUICK
  (function () {
    "use strict";
    XVOWS.args = program.tests;
    XVOWS.console = function () {
      var args = XT.$A(arguments);
      args.unshift("[XVOWS] ".yellow);
      console.log.apply(console, args);
      if (XVOWS.outfile && XVOWS.outfile.writeable) {
        XVOWS.log(args);
      }
    };
  }());

  relocate = function () {
    process.exit();
  };


  request.post({uri: "https://localhost/login/authenticate",
      json: true,
      body: {id: program.user, password: program.password}},
      function (authError, authResponse, authBody) {
    if (!authError && authResponse.statusCode === 200) {
      if (authBody.isError) {
        X.log(authBody.reason);
        return;
      }

      request.post({uri: "https://localhost/login/selection",
          json: true,
          body: {id: program.user, password: program.password, selected: program.organization}},
          function (selectError, selectResponse, selectBody) {
        if (!selectError && selectResponse.statusCode === 200) {
          XVOWS.details = {
            id: program.user,
            sid: authBody.sid,
            lastModified: authBody.lastModified,
            created: authBody.created,
            username: _.find(authBody.organizations, function (org) {return org.name === program.organization; }).username,
            organization: program.organization,
            organizations: authBody.organizations
          };
          XVOWS.emit("ready");
        }
      });
    }
  });

  return;

}());
