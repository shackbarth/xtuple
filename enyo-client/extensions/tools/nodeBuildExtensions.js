/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var fs = require('fs'),
  exec = require('child_process').exec,
  _ = require('underscore');

(function () {
  "use strict";

  var buildExtension, extensions, finish;

  buildExtension = function (extensionQueue, callback) {
    var ext, recurse;

    recurse = function (err, stdout, stderr) {
      if (err) {
        console.log("Error building enyo app", err);
      }
      console.log(ext, "extension has been built");

      // move the built extension into its proper directory
      fs.mkdirSync("./builds/" + ext);
      fs.renameSync("./build/app.js", "./builds/" + ext + "/" + ext + ".js");

      // actually recurse
      buildExtension(extensionQueue, callback);
    }

    if (extensionQueue.length === 0) {
      callback();
      return;
    }

    ext = extensionQueue.pop();

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("source/' + ext + '/client");';
    fs.writeFileSync("./package.js", rootPackageContents);

    // run the enyo deployment method asyncronously
    exec("./tools/deploy.sh", recurse);
  };

  extensions = fs.readdirSync("./source");

  finish = function () {
    fs.unlinkSync("./package.js");
    console.log("all done");
  };

  buildExtension(extensions, finish);

}());
