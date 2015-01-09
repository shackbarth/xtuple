/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true,
require:true, __dirname:true, console:true, process:true */


/**
  By convention, the test runner will look for .js files in the test/specs
  directory, and run any file with an export.specs. If there are any custom business
  logic tests to be run, those should go in the same file under a different export,
  export.additionalTests

  You can run tests for a particular business object by taking advantage of
  the -g flag.

  mocha -R spec -g XM.Invoice test/lib/test_runner.js

  To generate spec documentation:
  cd scripts
  ./generateSpecs.sh

*/


(function () {
  "use strict";

  var fs = require('fs'),
    _ = require("underscore"),
    path = require('path'),
    specFiles = _.filter(fs.readdirSync(path.join(__dirname, "../specs")), function (fileName) {
      // filter out .swp files, etc.
      return path.extname(fileName) === '.js';
    }).sort(),
    specs = _.map(specFiles, function (specFile) {
      var fileExports = require(path.join(__dirname, "../specs", specFile));
      if (!fileExports || !fileExports.spec) {
        console.log(specFile, "must export a spec. Use skipAll to skip it.");
        process.exit(1);
      }
      return fileExports;
    }),
    runSpec = require("./runner_engine").runSpec;

  _.each(specs, runSpec);

}());
