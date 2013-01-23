/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true, X:true, Backbone:true, require:true, DOCUMENT_HOSTNAME:true
_: true, _fs: true, _path: true, _util:true, vows: true, assert:true, io: true, program: true
request: true, process: true, XVOWS: true, ext: true, XM:true, relocate: true, setTimeout: true, exports: true
*/

require("./xt_setup");
require("./xvows");


var loadXtDependencies = function () {

  "use strict";
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
  "use strict";
  X.getCookie = function () {
    return X.json(XVOWS.details);
  };

  X.relativeDependsPath = _path.join(X.basePath, "node_modules/backbone-x/source");
  require("backbone-x");

  // GRAB THE LOAD ORDER WE WANT TO PRESERVE
  // FROM THE package.js FILE IN MODELS
  X.relativeDependsPath = _path.join(X.basePath, "../../source/models");
  require(_path.join(X.basePath, "../../source/models", "package.js"));
  require(_path.join(X.basePath, "../../source/ext", "core.js"));
  require(_path.join(X.basePath, "../../source/ext", "datasource.js"));
  // GRAB THE CRM MODULE
  require(_path.join(X.basePath, "../../../public-extensions/source/crm/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../../public-extensions/source/crm/client/models");
  require(_path.join(X.basePath, "../../../public-extensions/source/crm/client/models", "package.js"));
  // GRAB THE SALES MODULE
  require(_path.join(X.basePath, "../../../public-extensions/source/sales/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../../public-extensions/source/sales/client/models");
  require(_path.join(X.basePath, "../../../public-extensions/source/sales/client/models", "package.js"));
  // GRAB THE PROJECT MODULE
  require(_path.join(X.basePath, "../../../public-extensions/source/project/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../../public-extensions/source/project/client/models");
  require(_path.join(X.basePath, "../../../public-extensions/source/project/client/models", "package.js"));
  // GRAB THE CONNECT MODULE
  require(_path.join(X.basePath, "../../../private-extensions/source/connect/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../../private-extensions/source/connect/client/models");
  require(_path.join(X.basePath, "../../../private-extensions/source/connect/client/models", "package.js"));
  // GRAB THE INCIDENT PLUS MODULE
  require(_path.join(X.basePath, "../../../public-extensions/source/incident_plus/client", "core.js"));
  X.relativeDependsPath = _path.join(X.basePath, "../../../public-extensions/source/incident_plus/client/models");
  require(_path.join(X.basePath, "../../../public-extensions/source/incident_plus/client/models", "package.js"));
  // GRAB THE STARTUP TASKS
  require(_path.join(X.basePath, "../../source", "startup.js"));

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
  "use strict";
  process.exit();
};

  // replicate the two-step authentication and org-selection process
  // that's done with ajax in the login repository
var authenticate = function () {
  "use strict";
  var protocol = program.port === 443 ? "https" : "http";
  request.post({uri: protocol + "://" + program.host + ":" + program.port + "/login/authenticate",
      json: true,
      body: {id: program.user, password: program.password}},
      function (authError, authResponse, authBody) {
    if (!authError && authResponse.statusCode === 200) {
      if (authBody.isError) {
        X.log(authBody.reason);
        // this sigkill and all others will tell node-xt to exit with status = 1
        // which in turn will let jenkins know that the build failed.
        process.emit("SIGKILL");
        return;
      }

      request.post({uri: protocol + "://" + program.host + ":" + program.port + "/login/selection",
          json: true,
          body: {id: program.user, password: program.password, selected: program.organization}},
          function (selectError, selectResponse, selectBody) {
        var org;
        if (!selectError && selectResponse.statusCode === 200) {
          org = _.find(authBody.organizations, function (org) {return org.name === program.organization; });
          if (!org) {
            X.log("Invalid organization name");
            process.emit("SIGKILL");
            return;
          }

          XVOWS.details = {
            id: program.user,
            sid: authBody.sid,
            lastModified: authBody.lastModified,
            created: authBody.created,
            username: org.username,
            organization: program.organization,
            organizations: authBody.organizations
          };
          XVOWS.emit("ready");
        } else {
          X.log("Error on selection of organization.", selectError);
          process.emit("SIGKILL");
        }
      });
    } else {
      X.log("Error on authentication. Is the datasource running?", authError);
      process.emit("SIGKILL");
    }
  });
};


//......................................
// COMMAND LINE PARSING
var parseArgs = function (params) {
  "use strict";

  var tests = function (val) {
    return val.split(" ").map(String);
  };

  if (params) {
    // params passed in programmatically through hash
    params.user = params.user || "admin@xtuple.com";
    params.organization = params.organization || "dev";
    params.host = params.host || "localhost";
    params.port = params.port || 443;
    params.tests = tests(params.tests || '*');

    X.mixin(program, params);
    return;
  }
  // no hash passed in. Get the params through the CLI arguments.

  program
    .option("--spec", "Use the spec reporter")
    .option("-t, --tests [tests]", "Specify space-separated string of test names", tests, ["*"])
    .option("-u, --user [user]", "Global user ID (must be active global user)", "admin@xtuple.com")
    .option("-P, --password [password]", "Global user password", "")
    .option("-H, --host [host]", "Datasource hostname/ip", "localhost")
    .option("-p, --port [port]", "Datasource port", 443, parseInt)
    .option("-o, --organization [organization]", "Organization to run against", "dev")
    .parse(process.argv);
  if (program.spec) {
    var spec = require(_path.join(X.basePath, "node_modules/vows/lib/vows/reporters/spec"));
    var suite = require(_path.join(X.basePath, "node_modules/vows/lib/vows/suite")).Suite.prototype;
    suite.ext_run = suite.run;
    suite.run = function () {
      return suite.ext_run.call(this, {reporter: spec});
    };
  }
};

var initAll = function () {
  "use strict";
  loadXtDependencies();
  suppressOutput();
  loadXmDependencies();
  processArgs();
  authenticate();
};

exports.parseArgs = parseArgs;
exports.initAll = initAll;
