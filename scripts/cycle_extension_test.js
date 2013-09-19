#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

(function () {
  "use strict";

  var fs = require("fs"),
    path = require("path"),
    async = require("async"),
    require_uncache = require("require-uncache"),
    Mocha = require("mocha"),
    _ = require("underscore"),
    dataSource = require('../node-datasource/lib/ext/datasource').dataSource,
    sourceDirs = ["xtuple/enyo-client/extensions/source", "xtuple-extensions/source", "private-extensions/source"],
    options = {}; // TODO: get CLI arguments


  var creds;
  var getConfiguration = function (callback) {
    var config;

    // the backup path is not relative if it starts with a slash
    if (options.config && options.config.substring(0, 1) === '/') {
      config = require(options.config);
    } else if (options.config) {
      config = require(path.join(process.cwd(), options.config));
    } else {
      config = require(path.join(__dirname, "../node-datasource/config.js"));
    }
    creds = config.databaseServer;
    creds.host = creds.hostname; // adapt our lingo to node-postgres lingo
    creds.database = config.datasource.testDatabase;
    callback();
  };

  var extensions;
  var getExtensions = function (callback) {
    var processResponse = function (err, result) {
      extensions = result.rows;
      callback();
    };
    dataSource.query("select ext_id, ext_name, ext_location from xt.ext;", creds, processResponse);
  };

  var dependencies;
  var getDependencies = function (callback) {
    var processResponse = function (err, result) {
      dependencies = result.rows;
      callback();
    };
    dataSource.query("select extdep_from_ext_id as from_id, extdep_to_ext_id as to_id from xt.extdep;", creds, processResponse);
  };


  /*
  _.each(sourceDirs, function (sourceDir) {
    var subdirs = fs.readdirSync(path.join(__dirname, "../..", sourceDir));
    extensions.push(subdirs);
  });
  extensions = _.flatten(extensions);
  console.log(extensions);
  */

  var combinations = [];
  var getCombinations = function (callback) {
    // thanks http://stackoverflow.com/questions/4061080/output-each-combination-of-an-array-of-numbers-with-javascript
    var makeCombinations = function (numArr, choose, next) {
      var n = numArr.length;
      var c = [];
      var inner = function (start, choose_) {
        if (choose_ === 0) {
          next(c);
        } else {
          for (var i = start; i <= n - choose_; ++i) {
            c.push(numArr[i]);
            inner(i + 1, choose_ - 1);
            c.pop();
          }
        }
      };
      inner(0, choose);
    };

    var pushToCombinations = function (combo) {
      //console.log(combo);
      combinations.push(JSON.parse(JSON.stringify(combo))); // clone
    };
    for (var i = 1; i <= extensions.length; i++) {
      makeCombinations(extensions, i, pushToCombinations);
    }
    callback();
  };

  // don't bother testing combinations that violate dependencies
  var screenDependencies = function (callback) {
    combinations = _.filter(combinations, function (combo) {
      var violate = false;
      _.each(dependencies, function (dependency) {
        var comboIds = _.map(combo, function (ext) {
          return ext.ext_id;
        });
        if (_.contains(comboIds, dependency.from_id) && !_.contains(comboIds, dependency.to_id)) {
          violate = true;
          return;
        }
      });
      return !violate;
    });
    callback();
  };

  var setupEnvironmentsAndRunTests = function (masterCallback) {
    var setupEnvironment = function (combination, callback) {
      var options = JSON.parse(JSON.stringify(creds)),
        processResponse = function (err, result) {
          //console.log(arguments);
          callback();
        },
        ids = "",
        sql;

      _.each(combination, function (ext) {
        ids = ids + ext.ext_id + ", ";
      });
      ids = ids.substring(0, ids.length - 2);

      sql = "select xt.js_init();" +
        "delete from xt.usrext where usrext_usr_username LIKE 'admin';" +
        "insert into xt.usrext (usrext_usr_username, usrext_ext_id) " +
        "select 'admin', ext_id from xt.ext where ext_id in (" + ids + ");";

      //console.log(sql);

      // TODO: testCreds, actually.
      // TODO: use options.parameters

      dataSource.query(sql, options, processResponse);
    };

    var mocha;
    var runTests = function (combination, callback) {
      console.log("running tests on", JSON.stringify(_.map(combination, function (ext) {return ext.ext_name; })));
      // https://github.com/visionmedia/mocha/wiki/Using-mocha-programmatically
      if (mocha) {
        mocha.run(function (failures) {
          callback(failures);
        });
      } else {
        mocha = new Mocha({reporter: "spec"});
        // https://github.com/visionmedia/mocha/issues/445
        mocha.suite.on('pre-require', function (context, file) {
          require_uncache(file);
        });
        mocha.addFile(path.join(__dirname, "../test/mocha/lib/login.js"));
        mocha.addFile(path.join(__dirname, "../test/mocha/extensions/all/workspace_empty.js"));
        mocha.run(function (failures) {
          callback(failures);
        });
      }
    };

    var setupEnvironmentAndRunTests = function (combination, callback) {
      setupEnvironment(combination, function () {
        runTests(combination, callback);
      });
    };

    async.mapSeries(combinations, setupEnvironmentAndRunTests, function (err, res) {
      masterCallback(err, res);
    });
  };


  var finish = function (err, res) {
    console.log("all done", arguments);
    if (err) {
      process.exit(1);
    } else {
      process.exit(0);
    }
    //console.log(combinations.length);
    //console.log(dependencies);
  };

  async.series([
    getConfiguration,
    getExtensions,
    getDependencies,
    getCombinations,
    screenDependencies,
    setupEnvironmentsAndRunTests
  ], finish);

}());
