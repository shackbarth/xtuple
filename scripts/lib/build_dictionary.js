/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true */

// accommodate old string import mechanism
if (typeof XT === 'undefined') {
  XT = {};
}
// end accommodation

(function () {
  "use strict";

  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path");

  // accommodate old string import mechanism
  XT.stringsFor = function (language, hash) {
    console.log(hash);
  };
  XT.locale = {setLanguage: function () {}};
  // end accommodation

  var extensionDirs = [
    {repo: "xtuple-extensions", path: "xtuple-extensions/source", isExtension: true},
    {repo: "private-extensions", path: "private-extensions/source", isExtension: true},
    {path: "xtuple/enyo-client/application/source"},
    {path: "xtuple/enyo-client/extensions/source", isExtension: true},
    {path: "xtuple/lib/backbone-x/source"},
    {path: "xtuple/lib/enyo-x/source"},
    {path: "xtuple/lib/tools/source"}
  ];
  var getFilenames = function (spec, callback) {
    // TODO: don't look if the repo isn't there
    var fullPath = path.join(__dirname, "../../..", spec.path);
    var filenames;

    if (spec.isExtension) {
      fs.readdir(fullPath, function (err, files) {
        if (err && spec.repo) {
          // probably the repo just isn't installed
          callback();
          return;
        } else if (err) {
          callback(new Error("Cannot access path " + fullPath));
          return;
        }
        callback(null, _.map(files, function (file) {
          return path.join(fullPath, file, "client/en/strings.js");
        }));

      });
    } else {
      callback(null, [path.join(fullPath, "en/strings.js")]);
    }
  };

  var filenames;
  var getAllFilenames = function (callback) {
    async.map(extensionDirs, getFilenames, function (err, results) {
      if (err) {
        callback(err);
        return;
      }
      filenames = _.flatten(results);
      callback();
    });
  };

  var getTranslations = function (filename, callback) {
    fs.readFile(filename, function (err, data) {
      if (err) {
        // No problem. The file must not be defined.
        callback();
        return;
      }
      require(filename);
      callback();
    });
  };
  var getAllTranslations = function (callback) {
    async.map(filenames, getTranslations, function (err, results) {
      callback();
    });
  };

  async.series([
    getAllFilenames,
    getAllTranslations
  ], function (err, results) {
    if (err) {
      console.log("error:", err);
      return;
    }
    console.log("success");
    console.log(filenames);
  });
}());
