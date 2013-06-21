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

  var rootDir, buildExtension, finish;


  var enyoBuild = function (extPath, callback) {
    var extName;

    // TODO: a better node path function?
    extName = extPath.substring(extPath.lastIndexOf('/source/') + 8);

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extPath + '/client");';
    fs.writeFileSync("package.js", rootPackageContents);

    // run the enyo deployment method asyncronously
    exec(path.join(rootDir, "tools/deploy.sh"), function (err, stdout) {
      var code = fs.readFileSync("./build/app.js", "utf8"); // TODO: use async
      console.log(code);
      // TODO: instead, write to DB
      callback(); // TODO: err, res
    });
  };



  exports.buildClient = function (specs, creds, masterCallback) {

    var buildExtension = function (extPath, callback) {
      if (extPath.indexOf("/lib/orm") >= 0) { // TODO: better way to determine what dirs these are
        // this is lib/orm. There is nothing here to install on the client.
        callback();
        return;
      }


      if (extPath.indexOf("extensions") < 0) {
        // this is the core app, which has a different deploy process.
        exec(__dirname + "/../../enyo-client/application/tools/deploy.sh", function (err, stdout) {
          console.log("xTuple core has been built");
          // TODO: save to DB
          callback(err, stdout);
        });
        return;
      }

      console.log(extPath);
      var rootDir = extPath.substring(0, extPath.indexOf('/source/'));
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
    // TODO: nice 0!
    async.mapSeries(specs[0].extensions, buildExtension, function (err, res) {
      finish();
      masterCallback(err, res);

    });



    /*
    var buildExtension, rootDir, specifiedDir, extensions, finish,
      coreExtDir = __dirname + "/../../enyo-client/extensions/source/",
      buildCore = false;



    // TODO: the core build script is a bit different

    //
    //  Make the builds directory if it's not there
    //
    // rootDir is the directory that contains the source directory
    rootDir = extensions[0].substring(0, extensions[0].indexOf('/source/'));
    if (!fs.existsSync(rootDir + '/builds')) {
      fs.mkdirSync(rootDir + '/builds');
    }

    //
    //Symlink the enyo directories if they're not there
    //
    if (!fs.existsSync(rootDir + '/enyo')) {
      fs.symlinkSync(rootDir + "/xtuple/enyo-client/application/enyo", rootDir + '/enyo');
    }

    //
    // Go do it.
    //
    if (buildCore) {
      // if we want to build the core extensions, then first build the core itself
      exec(__dirname + "/../../enyo-client/application/tools/deploy.sh", function () {
        console.log("xTuple core has been built");
        buildExtension(extensions, finish);
      });

    } else {
      buildExtension(extensions, finish);
    }
    */

  };


  //
  // Define cleanup function
  //
  finish = function () {
    fs.unlinkSync("package.js");

    //fs.unlinkSync(rootDir + "/enyo"); // TODO
    rimraf("./build", function () {
      rimraf("./deploy", function () {
        console.log("all done");
      });
    });
  };


}());
