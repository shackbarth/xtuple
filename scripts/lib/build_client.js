#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var _ = require('underscore'),
  async = require('async'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf');

      // TODO: get rid of xtuple-extensions/scripts/buildExtensions

      // TODO: once we move people off of enyo-client/extensions/buildExtensions.sh, we can:
      //   -remove buildExtensions.sh and nodeBuildExtensions.js
      //   -remove the enyo submodule in that directory and use a temporary symlink

(function () {
  "use strict";

  var enyoBuild = function (extPath, callback) {
    var extName = path.basename(extPath); // the name of the extension

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extPath + '/client");';
    fs.writeFileSync("package.js", rootPackageContents);

    // run the enyo deployment method asyncronously
    var rootDir = path.join(extPath, "../..");
    exec(path.join(rootDir, "/tools/deploy.sh"), function (err, stdout) {
      if (err) {
        callback(err);
        return;
      }
      // XXX does enyo really put this relative to cwd?
      var code = fs.readFileSync(path.join(process.cwd(), "/build/app.js"), "utf8"); // TODO: use async
      callback(null, constructQuery(code, extName, "1.0.0", "js"));
    });
  };

  var constructQuery = function (contents, extension, version, language) {
    // TODO: sqli guard, not that we distrust the payload
    return "select xt.insert_client($$" + contents +
      "$$, '" + extension +
      "', '" + version +
      "', '" + language + "');";
  };


  //exports.buildClient = function (specs, creds, masterCallback) {

  exports.getClientSql = function (extPath, callback) {
    if (extPath.indexOf("/lib/orm") >= 0) { // TODO: better way to determine what dirs these are
      // this is lib/orm. There is nothing here to install on the client.
      callback(null, "");
      return;
    }


    if (extPath.indexOf("extensions") < 0) {
      // this is the core app, which has a different deploy process.
      exec(path.join(__dirname, "../../enyo-client/application/tools/deploy.sh"), function (err, stdout) {
        console.log("xTuple core client has been built");
        fs.readdir(path.join(__dirname, "../../enyo-client/application/build"), function (err, files) {
          var readFile;
          if (err) {
            callback(err);
            return;
          }
          readFile = function (filename, callback) {
            var callbackAdaptor = function (err, contents) {
              callback(err, {name: filename, contents: contents});
            };
            filename = path.join(__dirname, "../../enyo-client/application/build", filename);
            fs.readFile(filename, "utf8", callbackAdaptor);
          };
          async.map(files, readFile, function (err, results) {
            var cssResults = _.filter(results, function (result) {
                return path.extname(result.name) === ".css";
              }),
              sortedCssResults = _.sortBy(cssResults, function (result) {
                return path.basename(result.name) === "app.css";
              }),
              cssString = _.reduce(sortedCssResults, function (memo, result) {
                return memo + result.contents;
              }, ""),
              cssQuery = constructQuery(cssString, "_core", "1.0.0", "css"),
              jsResults = _.filter(results, function (result) {
                return path.extname(result.name) === ".js";
              }),
              sortedJsResults = _.sortBy(jsResults, function (result) {
                return path.basename(result.name) === "app.js";
              }),
              jsString = _.reduce(sortedJsResults, function (memo, result) {
                return memo + result.contents;
              }, ""),
              jsQuery = constructQuery(jsString, "_core", "1.0.0", "js");

            callback(null, cssQuery + jsQuery);
          });
        });
      });
      return;
    }

    // TODO async
    var rootDir = path.join(extPath, "../..");
    if (!fs.existsSync(path.join(rootDir, 'builds'))) {
      fs.mkdirSync(path.join(rootDir, 'builds'));
    }

    //
    //Symlink the enyo directories if they're not there
    //
    if (!fs.existsSync(path.join(rootDir, 'enyo'))) {
      console.log("symlinking", path.join(rootDir, 'enyo'));
      fs.symlinkSync(path.join(__dirname, "../../enyo-client/application/enyo"), path.join(rootDir, 'enyo'));
    }

    enyoBuild(extPath, function (err, res) {
      // TODO: handle err
      callback(err, res);
    });
  };

  //
  // Define cleanup function
  //
  exports.cleanup = function (callback) {
    fs.unlinkSync(path.join(process.cwd(), "package.js"));

    //fs.unlinkSync(rootDir + "/enyo"); // TODO
    rimraf(path.join(process.cwd(), "build"), function () {
      rimraf(path.join(process.cwd(), "deploy"), function () {
        callback("all done");
      });
    });
  };


}());
