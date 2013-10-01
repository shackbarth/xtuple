/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    async = require("async"),
    datasource = require("../../node-datasource/lib/ext/datasource").dataSource,
    fs = require("fs"),
    creds,
    path = require("path");

  var fileSpecs;
  var translations = {};

  var createQuery = function (strings, context) {
    return "select xt.set_dictionary_strings($$%@$$, '%@');".f(JSON.stringify(strings), context || "_null_");
  };

  var getDictionarySql = exports.getDictionarySql = function (extension, callback) {
    console.log("get dictionary sql", extension);
    var isLibOrm = extension.indexOf("lib/orm") >= 0,
      isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
        extension.indexOf("extension") < 0,
      clientHash,
      databaseHash,
      dictionaryHash,
      filename,
      extensionName;

    if (isLibOrm) {
      dictionaryHash = _.union(
        require(path.join(extension, "../enyo-x/source/en/strings.js")).strings,
        require(path.join(extension, "../tools/source/en/strings.js")).strings
      );

      callback(null, createQuery(dictionaryHash));
    } else if (isApplicationCore) {
      clientHash = require(path.join(extension, "application/source/en/strings.js")).strings;
      databaseHash = require(path.join(extension, "database/source/en/strings.js")).strings;

      callback(null, createQuery(clientHash) + createQuery(databaseHash, "_database_"));

    } else {
      filename = path.join(extension, "client/en/strings.js");
      fs.exists(filename, function (exists) {
        if (exists) {
          extensionName = path.basename(extension).replace("/", "");
          console.log("ext name is", extensionName);
          callback(null, createQuery(require(filename).strings, extensionName));
        } else {
          // no problem. Maybe there is just no strings file
          callback(null, '');
        }
      });
    }
  };

}());
