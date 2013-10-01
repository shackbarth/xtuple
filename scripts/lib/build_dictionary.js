/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    fs = require("fs"),
    path = require("path"),
    createQuery = function (strings, context) {
      return "select xt.set_dictionary_strings($$%@$$, '%@');".f(JSON.stringify(strings), context || "_null_");
    };

  exports.getDictionarySql = function (extension, callback) {
    var isLibOrm = extension.indexOf("lib/orm") >= 0,
      isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
        extension.indexOf("extension") < 0,
      dictionaryHash,
      filename;

    if (isLibOrm) {
      // arbitrary convention: the builder for lib/orm will
      // smash the tools, enyo-x, and app core strings together
      dictionaryHash = _.extend(
        require(path.join(extension, "../enyo-x/source/en/strings.js")).strings,
        require(path.join(extension, "../tools/source/en/strings.js")).strings,
        require(path.join(extension, "../../enyo-client/application/source/en/strings.js")).strings
      );
      callback(null, createQuery(dictionaryHash));

    } else if (isApplicationCore) {
      // arbitrary convention: the builder for enyo-client
      // will take care of the database strings
      dictionaryHash = require(path.join(extension, "database/source/en/strings.js")).strings;
      callback(null, createQuery(dictionaryHash, "_database_"));

    } else {
      // return the extension strings if they exist
      filename = path.join(extension, "client/en/strings.js");
      fs.exists(filename, function (exists) {
        if (exists) {
          callback(null, createQuery(require(filename).strings,
            path.basename(extension).replace("/", "")));
        } else {
          // no problem. Maybe there is just no strings file
          callback(null, '');
        }
      });
    }
  };
}());
