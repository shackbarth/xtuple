/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, X:true, Backbone:true, require:true, DOCUMENT_HOSTNAME:true
_: true, _fs: true, _path: true, _util:true, vows: true, assert:true, io: true, program: true
request: true, process: true, XVOWS: true, ext: true, XM:true, relocate: true, setTimeout: true
*/

var loadXtDependencies = function () {

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

};

  // suppress normal output and pipe to file
var suppressOutput = function () {
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
};

  //......................................
  // INCLUDE ALL THE NECESSARY XM FRAMEWORK
  // DEPENDENCIES
  //

  // LOAD ALL MODELS
  //
var loadXmDependencies = function () {
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

};

  // PROCESS ANY INCOMING ARGS REAL QUICK
var processArgs = function () {
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
};

relocate = function () {
  process.exit();
};

  // replicate the two-step authentication and org-selection process
  // that's done with ajax in the login repository
var authenticate = function () {
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
    } else {
      X.log("Error on authentication. Is the datasource running?");
    }
  });
};

var initAll = function () {
  loadXtDependencies();
  suppressOutput();
  loadXmDependencies();
  processArgs();
  authenticate();
}

exports.initAll = initAll;
