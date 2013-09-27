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
    datasource = require("../../node-datasource/lib/ext/datasource").dataSource,
    fs = require("fs"),
    creds,
    path = require("path");

  var translations = {};
  // accommodate old string import mechanism
  XT.stringsFor = function (language, hash) {
    _.each(hash, function (value, key) {
      // TODO: we should also validate that the key is not defined twice,
      // unless both definitions are in extensions
      if (translations[key] && translations[key] !== value) {
        throw new Error("key " + key + " is defined with two different translations");
      }

      translations[key] = value;
    });
  };
  XT.locale = {setLanguage: function () {}};
  // end accommodation

  var extensionDirs = [
    {path: "xtuple/lib/backbone-x/source"},
    {path: "xtuple/lib/enyo-x/source"},
    {path: "xtuple/lib/tools/source"},
    {path: "xtuple/enyo-client/application/source"},
    {path: "xtuple/enyo-client/extensions/source", isExtension: true},
    {repo: "xtuple-extensions", path: "xtuple-extensions/source", isExtension: true},
    {repo: "private-extensions", path: "private-extensions/source", isExtension: true}
  ];
  var getFilenames = function (spec, callback) {
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
    fs.exists(filename, function (exists) {
      if (!exists) {
        // No problem. The file must not be defined.
        callback();
        return;
      }
      try {
        require(filename);
      } catch (error) {
        callback(error);
        return;
      }
      callback(null, "Imported translations from " + filename);
    });
  };
  var getAllTranslations = function (callback) {
    async.map(filenames, getTranslations, function (err, results) {
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
      _.each(translations, function (value, key) {
        var sql,
          options,
          dbTranslation = dataKeys[key];

        if (dbTranslation && dbTranslation === value) {
          // We already have this one. Do nothing.

        } else if (dbTranslation) {
          // the translation has been updated
          // TODO

        } else {
          // this is a new translation
          sql = "insert into dictentry " +
            "(dictentry_dict_id, dictentry_key, dictentry_translation) " +
            " values ($1, $2, $3);";

          options = JSON.parse(JSON.stringify(creds));
          options.parameters = [
            englishDictionaryId,
            key,
            value
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
      console.log(callbacksExpected);
      if (callbacksExpected === 0) {
        callback();
      }
    });
  };

  var buildDictionary = exports.buildDictionary = function (_creds) {
    creds = _creds;
    async.series([
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
