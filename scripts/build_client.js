#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var fs = require('fs'),
  exec = require('child_process').exec,
  rimraf = require('rimraf'),
  _ = require('underscore');

(function () {
  "use strict";

  var argv, buildExtension, rootDir, specifiedDir, extensions, finish;

  //
  // Recurse down the array of the extensions to be built
  //
  buildExtension = function (extensionQueue, callback) {
    var extDir, extName, recurse;

    recurse = function (err, stdout, stderr) {
      var buildDir;

      if (err) {
        console.log("Error building enyo app", err);
      }
      console.log(extDir, "extension has been built");

      // move the built extension into its proper directory
      buildDir = extDir.replace('/source/', '/builds/');
      // delete it
      rimraf(buildDir, function () {
        // make it
        fs.mkdirSync(buildDir);
        // populate it
        fs.renameSync("./build/app.js", buildDir + "/" + extName + ".js");

        // actually recurse
        buildExtension(extensionQueue, callback);
      });
    };

    if (extensionQueue.length === 0) {
      callback();
      return;
    }

    extDir = extensionQueue.pop();
    extName = extDir.substring(extDir.lastIndexOf('/source/') + 8);

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extDir + '/client");';
    fs.writeFileSync("package.js", rootPackageContents);

    // run the enyo deployment method asyncronously
    exec(rootDir + "/tools/deploy.sh", recurse);
  };

  //
  // Determine which extensions we want to build
  //
  argv = process.argv;
  if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    // regex: remove trailing slash if present
    specifiedDir = argv[argv.indexOf("-e") + 1].replace(/\/$/, "");
    extensions = [specifiedDir];
  } else {
    // add the core extensions
    // TODO: rmrf with node, remove buildExtensions.sh, move to /scripts directory
    // this isn't complete for 1.3.5, so users should continue to use the old script
    console.log("You need to specify an extension with -e followed by the path to the extension");
    process.exit(1);
    extensions = fs.readdirSync("./source");
  }

  //
  // Define cleanup function
  //
  finish = function () {
    fs.unlinkSync("package.js");
    fs.unlinkSync(rootDir + "/enyo");
    rimraf("./build", function () {
      rimraf("./deploy", function () {
        console.log("all done");
      });
    });
  };

  /**
    Make the builds directory if it's not there
   */
  // rootDir is the directory that contains the source directory
  rootDir = extensions[0].substring(0, extensions[0].indexOf('/source/'));
  if (!fs.existsSync(rootDir + '/builds')) {
    fs.mkdirSync(rootDir + '/builds');
  }

  /**
    Symlink the enyo directories if they're not there
   */
  if (!fs.existsSync(rootDir + '/enyo')) {
    fs.symlinkSync(rootDir + "/xtuple/enyo-client/application/enyo", rootDir + '/enyo');
  }

  //
  // Go do it.
  //
  buildExtension(extensions, finish);

}());
