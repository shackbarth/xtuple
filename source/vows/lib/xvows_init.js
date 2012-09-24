(function () {

  // native
  _fs             = X.fs;
  _path           = X.path;
  _util           = X.util;

  // third-party
  Backbone            = require("backbone");
  BackboneRelational  = require("backbone-relational");
  vows                = require("vows");
  assert              = require("assert");
  _                   = require("underscore");
  io                  = require("socket.io-client");
  program             = require("commander");
  require("tinycolor"); /*tinycolor*/

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
      .option("-H, --host [host]", "Datasource hostname/ip", "localhost")
      .option("-p, --port [port]", "Datasource port", 443, parseInt)
      .option("-o, --organization [organization]", "Organization to run against", "production")
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
      _.each(X.directoryFiles(path, {fullPath: true, extension: ".js"}), function(file) {
        hash[_path.basename(file)] = file;
      });
      this.set("tests", hash);
    },

    begin: function () {
      "use strict";
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

    nexted: null,

    /**
      Creates a working model and automatically checks state
      is `READY_NEW` and a valid `id` immediately afterward.

      Note: This function assumes the `id` is fetched automatically.
      For models with manually created ids such as 'XM.UserAccount',
      create a topic manually.

      @param {String|Object} Model
      @param {Object} Vows
    */
    create: function (model, vows) {
      "use strict";
      vows = vows || {};
      var context = {
        topic: function () {
          var that = this,
            timeoutId,
            Klass,
            auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
            callback = function (model, value) {
              if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
                // Check that the AUTO...NUMBER property has been set.
                if (model.get(model.documentKey) && model.id) {
                  clearTimeout(timeoutId);
                  model.off('change:' + model.documentKey, callback);
                  model.off('change:id', callback);
                  that.callback(null, model);
                }
              } else {
                clearTimeout(timeoutId);
                model.off('change:id', callback);
                that.callback(null, model);
              }
            };

          if (typeof model === 'string') {
            Klass = Backbone.Relational.store.getObjectByName(model);
            model = new Klass();
          }
          model.on('change:id', callback);
          // Add an event handler when using a model with an AUTO...NUMBER.
          if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
            model.on('change:' + model.documentKey, callback);
          }
          model.initialize(null, {isNew: true});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, model);
          }, XVOWS.wait);
        },
        'Status is `READY_NEW`': function (model) {
          assert.equal(model.getStatusString(), 'READY_NEW');
        },
        'ID is valid': function (model) {
          assert.isNumber(model.id);
        }
      };

      // Add in any other passed vows
      _.extend(context, vows);
      return context;
    },

    /**
      Saves the working model and automatically checks state
      is `READY_CLEAN` immediately afterward.

      @param {String|Object} Model
      @param {Object} Vows
    */
    save: function (model, vows) {
      "use strict";
      vows = vows || {};
      var context = {
        topic: function () {
          var that = this,
            timeoutId,
            callback = function () {
              var status = model.getStatus(),
                K = XM.Model;
              if (status === K.READY_CLEAN) {
                clearTimeout(timeoutId);
                model.off('statusChange', callback);
                that.callback(null, model);
              }
            };
          model.on('statusChange', callback);
          model.save();

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, model);
          }, XVOWS.wait);
        },
        'Status is `READY_CLEAN`': function (model) {
          assert.equal(model.getStatusString(), 'READY_CLEAN');
        }
      };

      // Add in any other passed vows
      _.extend(context, vows);
      return context;
    },

    /**
      Check before updating the working model that the state is `READY_CLEAN`.

      @param {String|Object} Model
      @param {Object} Vows
    */
    update: function (model, vows) {
      "use strict";
      vows = vows || {};
      var context = {
        topic: function () {
          return model;
        },
        'Status is `READY_CLEAN`': function (model) {
          assert.equal(model.getStatusString(), 'READY_CLEAN');
        }
      };

      // Add in any other passed vows
      _.extend(context, vows);
      return context;
    },

    /**
      Destorys the working model and automatically checks state
      is `DESTROYED_CLEAN` immediately afterward.

      @param {Object} Vows
    */
    destroy: function (model, vows, obj) {
      "use strict";
      vows = vows || {};
      var context = {
        topic: function () {
          var that = this,
            timeoutId,
            callback = function () {
              var status = model.getStatus(),
                K = XM.Model;
              if (status === K.DESTROYED_CLEAN) {
                clearTimeout(timeoutId);
                model.off('statusChange', callback);
                that.callback(null, model);
              }
            };
          model.on('statusChange', callback);
          model.destroy();

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, model);
          }, XVOWS.wait);
        },
        'Status is `DESTROYED_CLEAN`': function (model) {
          assert.equal(model.getStatusString(), 'DESTROYED_CLEAN');
        }
      };
      // Add in any other passed vows
      _.extend(context, vows);
      return context;
    }
  });

  user = program.user;
  organization = program.organization;

  // create the cache for session control
  sessionCache = X.Cache.create({prefix: "session"});
  userCache = X.Cache.create({prefix: "user"});

  K = userCache.model("User");
  K.findOne({id: user}, ["organizations"], function (err, res) {
    var msg, organizations;
    if (err || !res) issue(X.fatal("could not find the requested global user", err.message));
    organizations = _.pluck(res.organizations, "name");
    if (organizations.indexOf(organization) === -1) {
      msg = "Could not find the organization '%@' for user '%@', ".f(organization, user);
      msg = msg.suf("available organizations are '%@'".f(organizations.join(", ")));
      issue(X.fatal(msg));
    }

    username = res.organizations[organizations.indexOf(organization)].username;
    sid = X.generateSID();
    K = sessionCache.model("Session");
    k = new K((XVOWS.details = details = {
      id: user,
      sid: sid,
      lastModified: X.timestamp(),
      created: X.timestamp(),
      username: username,
      organization: organization,
      organizations: organizations
    }));
    k.save(function (err) {
      if (err) issue(X.fatal("Could not create a valid session", err.message));
      X.Object.create({
        cleanupCompletedEvent: "cleanupCompleted",
        cleanup: function () {
          k.remove(_.bind(function () {
            X.log("Vows session removed");
            this.emit(this.cleanupCompletedEvent);
          }, this));
        },
        init: function () {
          X.addCleanupTask(_.bind(this.cleanup, this), this);
        }
      });

      //......................................
      // INCLUDE ALL THE NECESSARY XT FRAMEWORK
      // DEPENDENCIES
      DOCUMENT_HOSTNAME = "";
      [
        "foundation",
        "error",
        "log",
        "datasource",
        "math",
        "request",
        "response",
        "session",
        "locale",
        "ext/proto/string",
        "ext/string",
        "ext/startup_task",
        "en/strings"
      ].map(function (path) {
        "use strict";
        return _path.join(X.basePath, "../xt", path) + ".js";
      }).forEach(function (path) {
        "use strict";
        require(path);
      });

      XT.app = {show: X.$P};

      // CRUSH QUIET SMASH AND DESTROY ANY NORMAL OUTPUT FOR NOW
      // ...actually just...pipe it to some file...
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

        X.addCleanupTask(function (){
          if (XVOWS.outfile) XVOWS.outfile.destroySoon();
        });
      }());

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
      require("./enyo_placeholder");
      enyo.relativePath = _path.join(X.basePath, "../xm/ext");
      require(_path.join(X.basePath, "../xm/ext/package.js"));
      //require(_path.join(X.basePath, "../xm/ext", "model.js"));
      //require(_path.join(X.basePath, "../xm/ext", "collection.js"));
      // GRAB THE LOAD ORDER WE WANT TO PRESERVE
      // FROM THE package.js FILE IN MODELS
      enyo.relativePath = _path.join(X.basePath, "../xm/models");
      require(_path.join(X.basePath, "../xm/models", "package.js"));
      require(_path.join(X.basePath, "../ext/crm", "core.js"));
      // GRAB THE CRM MODULE
      enyo.relativePath = _path.join(X.basePath, "../ext/crm/xm/models");
      require(_path.join(X.basePath, "../ext/crm/xm/models", "package.js"));
      // GRAB THE STARTUP TASKS
      require(_path.join(X.basePath, "../xm", "startup.js"));

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

      XVOWS.emit("ready");

    });
  });
}());