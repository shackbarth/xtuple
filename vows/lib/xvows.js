/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, X:true, Backbone:true, require:true, DOCUMENT_HOSTNAME:true
_: true, _fs: true, _path: true, _util:true, vows: true, assert:true, io: true, program: true
request: true, process: true, XVOWS: true, ext: true, XM:true, relocate: true, setTimeout: true
*/

(function () {



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

}());
