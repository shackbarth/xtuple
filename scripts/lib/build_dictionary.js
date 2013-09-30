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

  var fileSpecs = [
    {path: "xtuple/lib/enyo-x/source"},
    {path: "xtuple/lib/tools/source"},
    {path: "xtuple/enyo-client/application/source"}
  ];

  var getRegisteredExtensions = function (callback) {
    var sql = "select * from xt.ext;";

    datasource.query(sql, creds, function (err, results) {
      var registeredExtensions = _.map(results.rows, function (result) {
        var extensionPath = result.ext_location === "/core-extensions" ?
          "xtuple/enyo-client/extensions" :
          result.ext_location.substring(0);

        return {
          path: path.join(extensionPath, "source", result.ext_name),
          extensionId: result.ext_id
        };
      });
      fileSpecs = _.union(fileSpecs, registeredExtensions);
      callback();
    });
  };

  var getFilenames = function (spec, callback) {
    var basePath = path.join(__dirname, "../../..", spec.path),
      stringsPath = spec.extensionId ? "client/en/strings.js" : "en/strings.js",
      fullPath = path.join(basePath, stringsPath);

    spec.filename = fullPath;
    callback();
  };

  var getAllFilenames = function (callback) {
    async.map(fileSpecs, getFilenames, callback);
  };

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
        // TODO: we should also validate that the key is not defined twice,
        // unless both definitions are in extensions
        if (translations[key] && translations[key].value !== value) {
          throw new Error("key " + key + " is defined with two different translations");
        }

        translations[key] = {value: value, extension: spec.extensionId};
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

  var englishDictionaryId;
  var getEnglishDictionary = function (callback) {
    var sql = "select dict_id from xt.dict where dict_language_name = 'en_US';",
      createSql = "insert into xt.dict (dict_language_name) values ('en_US')";

    datasource.query(sql, creds, function (err, results) {
      if (err) {
        callback(err);
        return;
      }
      if (results.rowCount === 0) {
        // need to create the dictionary
        datasource.query(createSql, creds, function (err, results) {
          datasource.query(sql, creds, function (err, results) {
            if (err) {
              callback(err);
              return;
            }
            englishDictionaryId = results.rows[0].dict_id;
            callback();
          });
        });
      } else {
        englishDictionaryId = results.rows[0].dict_id;
        callback();
      }
    });
  };

  var getEnglishDictionaryData = function (callback) {
    // TODO: real SQL
    datasource.query("select * from xt.dictentry where dictentry_dict_id = " + englishDictionaryId + ";",
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
            "(dictentry_dict_id, dictentry_key, dictentry_translation, dictentry_ext_id) " +
            " values ($1, $2, $3, $4);";

          options = JSON.parse(JSON.stringify(creds));
          options.parameters = [
            englishDictionaryId,
            key,
            translation.value,
            translation.extension
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

  var buildDictionary = exports.buildDictionary = function (_creds) {
    creds = _creds;
    async.series([
      getRegisteredExtensions,
      getAllFilenames,
      getAllTranslations,
      getEnglishDictionary,
      getEnglishDictionaryData
    ], function (err, results) {
      if (err) {
        console.log("error:", err);
        return;
      }
      console.log("success", results);
    });
  };

  var localSpecs = {
    hostname: "localhost",
    port: 5432,
    user: "admin",
    password: "admin",
    database: "dev"
  };
  buildDictionary(localSpecs);

}());
