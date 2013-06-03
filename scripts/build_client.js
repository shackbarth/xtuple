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

  var argv, buildExtension, rootDir, specifiedDir, extensions, finish,
    coreExtDir = __dirname + "/../enyo-client/extensions/source/",
    buildCore = false;

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
      console.log(extName, "extension has been built");

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
  // Determine which extensions we want to build. If there is no -e flag,
  // then build the core and the core extensions
  //
  argv = process.argv;
  if (argv.indexOf("-h") >= 0) {
    console.log("Usage:");
    console.log("sudo ./build_client.js");
    console.log("  will build the core and the core extensions");
    console.log("sudo ./build_client.js -e path/to/ext");
    console.log("  will build the extension at that path");
    console.log("  e.g. sudo ./build_client -e ../../private-extensions/source/ppm");
    return;
  } else if (argv.indexOf("-e") >= 0) {
    // the user has specified a particular extension
    // regex: remove trailing slash if present
    specifiedDir = argv[argv.indexOf("-e") + 1].replace(/\/$/, "");
    extensions = [specifiedDir];
  } else {
    // add the core extensions
    buildCore = true;
    // get the core extension directory names
    extensions = fs.readdirSync(coreExtDir);
    // actually we want these with a full path
    extensions = _.map(extensions, function (name) {
      return coreExtDir + name;
    });
    // TODO: get rid of xtuple-extensions/scripts/buildExtensions

    // TODO: once we move people off of enyo-client/extensions/buildExtensions.sh, we can:
    //   -remove buildExtensions.sh and nodeBuildExtensions.js
    //   -remove the enyo submodule in that directory and use a temporary symlink

  }

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
  if (buildCore) {
    // if we want to build the core extensions, then first build the core itself
    exec(__dirname + "/../enyo-client/application/tools/deploy.sh", function () {
      console.log("xTuple core has been built");
      buildExtension(extensions, finish);
    });

  } else {
    buildExtension(extensions, finish);
  }

}());
