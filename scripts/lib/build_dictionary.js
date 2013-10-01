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
  var getTranslations = function (spec, callback) {
    fs.exists(spec.filename, function (exists) {
      if (!exists) {
        // No problem. The file must not be defined.
        callback();
        return;
      }
      var strings = require(spec.filename).strings;
      _.each(strings, function (value, key) {
        if (translations[key] && translations[key].value !== value) {
          // XXX this doesn't do much good because we process each extension at a time
          throw new Error("key " + key + " is defined with two different translations");
        }

        translations[key] = {value: value, extension: spec.extensionId, isDatabase: spec.isDatabase || false};
      });

      callback(null, "Imported translations from " + spec.filename);
    });
  };
  var getAllTranslations = function (callback) {
    console.log(fileSpecs);

    async.map(fileSpecs, getTranslations, function (err, results) {
      if (err) {
        callback(err);
        return;
      }
      console.log("" + Object.keys(translations).length, "translated phrases and words");
      callback(null, results);
    });
  };

  var getEnglishDictionaryData = function (callback) {
    // TODO: real SQL
    datasource.query("select * from xt.dictentry where dictentry_dict_id = ;",
        creds, function (err, results) {
      if (err) {
        callback(err);
        return;
      }
      var dataKeys = _.reduce(results.rows, function (memo, row) {
        memo[row.dictentry_key] = row.dictentry_translation;
        return memo;
      }, {});

      var callbacksExpected = 0;
      var callbacksReceived = 0;
      _.each(translations, function (translation, key) {
        var sql,
          options,
          dbTranslation = dataKeys[key];

        if (dbTranslation && dbTranslation === translation.value) {
          // We already have this one. Do nothing.

        } else if (dbTranslation) {
          // the translation has been updated
          // TODO

        } else {
          // this is a new translation
          sql = "insert into dictentry " +
            "(dictentry_dict_id, dictentry_key, dictentry_translation, dictentry_ext_id, dictentry_is_database) " +
            " values ($1, $2, $3, $4, $5);";

          options = JSON.parse(JSON.stringify(creds));
          options.parameters = [
            //englishDictionaryId,
            key,
            translation.value,
            translation.extension,
            translation.isDatabase
          ];
          callbacksExpected++;

          datasource.query(sql, options, function (err, results) {
            if (err) {
              callback(err);
              return;
            }
            callbacksReceived++;
            if (callbacksExpected === callbacksReceived) {
              callback();
            }
          });
        }
      });
      if (callbacksExpected === 0) {
        callback();
      }
    });
  };

  var createQuery = function (strings, context) {
    return "select xt.set_dictionary_strings($$%@$$, '%@');".f(JSON.stringify(strings), context || "_null_");
  };

  var getDictionarySql = exports.getDictionarySql = function (extension, callback) {
    var isLibOrm = extension.indexOf("lib/orm") >= 0,
      isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
        extension.indexOf("extension") < 0,
      clientHash,
      databaseHash,
      dictionaryHash;

    if (isLibOrm) {
      dictionaryHash = _.union(
        require(path.join(extension, "../enyo-x/source/en/strings.js")).strings,
        require(path.join(extension, "../tools/source/en/strings.js")).strings
      );
      callback(null, createQuery(dictionaryHash));
    } else if (isApplicationCore) {
      clientHash = require(path.join(extension, "source/en/strings.js")).strings;
      databaseHash = require(path.join(extension, "../database/source/en/strings.js")).strings;

      callback(null, createQuery(clientHash) + createQuery(databaseHash, "_database_"));

    } else {
      var filename = path.join(extension, "client/source/en/strings.js");
      fs.exists(filename, function (exists) {
        var extensionName = path.basename(extension);
        callback(null, createQuery(require(filename).strings, path.basename(extension)));
      });
    }
  };

  getDictionarySql("/home/shackbarth/git/xtuple/lib/orm", function (err, results) {
    console.log(err, results);
  });

/*
  var localSpecs = {
    hostname: "localhost",
    port: 5432,
    user: "admin",
    password: "admin",
    database: "dev"
  };
  buildDictionary(localSpecs);
*/
}());
