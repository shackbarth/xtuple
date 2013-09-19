#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/

(function () {
  "use strict";

  var fs = require("fs"),
    path = require("path"),
    async = require("async"),
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
    dataSource.query("select extdep_from_ext_id, extdep_to_ext_id from xt.extdep;", creds, processResponse);
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
        if (_.contains(combo, dependency.from) && !_.contains(combo, dependency.to)) {
          violate = true;
          return;
        }
      });
      return !violate;
    });
    callback();
  };

  // TODO: get these for real from pg
  /*
  var dependencies = [
    {from: "incident_plus", to: "crm"},
    {from: "standard", to: "inventory"}
  ];
  */
  var finish = function (err, res) {
    console.log(combinations);
  };
  async.series([
    getConfiguration,
    getExtensions,
    getDependencies,
    getCombinations,
    screenDependencies

  ], finish);

}());
