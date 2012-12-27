/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global require:true, exports: true, process: true, program: true, _path: true, X: true
*/

(function () {
  _path               = X.path;
  program             = require("commander");

  var acceptParams = function (user, password) {
    program.user = user;
    program.password = password;
  };
  exports.acceptParams = acceptParams;


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
    if (program.spec) {
      var spec = require(_path.join(X.basePath, "node_modules/vows/lib/vows/reporters/spec"));
      var suite = require(_path.join(X.basePath, "node_modules/vows/lib/vows/suite")).Suite.prototype;
      suite.ext_run = suite.run;
      suite.run = function () {
        return suite.ext_run.call(this, {reporter: spec});
      };
    }
  }());
}());
