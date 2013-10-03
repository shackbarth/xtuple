/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true */

if (typeof XT === 'undefined') {
  XT = {};
}

(function () {
  "use strict";


  var _ = require("underscore"),
    async = require("async"),
    fs = require("fs"),
    path = require("path"),
    locale = require("../../lib/tools/source/locale"),
    createQuery = function (strings, context, language) {
      return "select xt.set_dictionary($$%@$$, '%@', '%@');"
        .f(JSON.stringify(strings),
          context || "_core_",
          language || "en_US");
    };

  exports.getDictionarySql = function (extension, callback) {
    var isLibOrm = extension.indexOf("lib/orm") >= 0,
      isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
        extension.indexOf("extension") < 0,
      stringsHash,
      filename;

    if (isLibOrm) {
      // smash the tools and enyo-x, and application core strings together into one query
      // strictly speaking we should build the application core strings during the application
      // core build, but we would need to take care not to wipe these out.
      stringsHash = _.extend(
        require(path.join(extension, "../enyo-x/source/en/strings.js")).language.strings,
        require(path.join(extension, "../tools/source/en/strings.js")).language.strings,
        require(path.join(extension, "../../enyo-client/application/source/en/strings.js")).language.strings
      );
      callback(null, createQuery(stringsHash));

    } else if (isApplicationCore) {
      // build the database strings. It's an arbitrary decision that enyo-client = database
      // and lib/orm = client.
      stringsHash = require(path.join(extension, "database/source/en/strings.js")).language.strings;
      callback(null, createQuery(stringsHash, "_database_"));

    } else {
      // return the extension strings if they exist
      filename = path.join(extension, "client/en/strings.js");
      fs.exists(filename, function (exists) {
        if (exists) {
          callback(null, createQuery(require(filename).language.strings,
            path.basename(extension).replace("/", "")));
        } else {
          // no problem. Maybe there is just no strings file
          callback(null, '');
        }
      });
    }
  };

  var dataSource = require('../../node-datasource/lib/ext/datasource').dataSource;
  var querystring = require("querystring");
  var request = require("request");

  // ask google
  var autoTranslate = function (text, apiKey, destinationLang, callback) {
    if (!apiKey || !destinationLang || !text) {
      // the user doesn't want to autotranslate
      callback(null, "");
      return;
    }

    if (destinationLang.indexOf("_") >= 0) {
      // strip off the locale for google
      destinationLang = destinationLang.substring(0, destinationLang.indexOf("_"));
    }

    var query = {
        source: "en",
        target: destinationLang,
        key: apiKey,
        q: text
      },
      url = "https://www.googleapis.com/language/translate/v2?" + querystring.stringify(query);

    request.get(url, function (err, resp, body) {
      if (err) {
        callback(err);
        return;
      }
      var response = JSON.parse(body);
      if (response.error) {
        callback(response.error);
        return;
      }
      var translations = response.data.translations;
      if (translations.length !== 1 || !translations[0].translatedText) {
        console.log("could not parse translations", JSON.stringify(translations));
        callback(null, "");
        return;
      }
      var translation = translations[0].translatedText;
      callback(null, translation);
    });

  };


  /**
    @param {String} database. The database name, such as "dev"
    @param {String} apiKey. Your Google Translate API key. Leave blank for no autotranslation
    @param {String} destinationLang. In form "es_MX".
    @param {Function} masterCallback
   */
  exports.exportEnglish = function (database, apiKey, destinationLang, masterCallback) {
    var creds = require("../../node-datasource/config").databaseServer,
      sql = "select dict_strings, dict_is_database, ext_name from xt.dict left join xt.ext on dict_ext_id = ext_id where dict_language_name = 'en_US'";

    creds.database = database;
    dataSource.query(sql, creds, function (err, res) {

      var processExtension = function (row, extensionCallback) {
        var stringsArray = _.map(JSON.parse(row.dict_strings), function (value, key) {
          return {value: value, key: key};
        });
        var processString = function (stringObj, stringCallback) {
          autoTranslate(stringObj.value, apiKey, destinationLang, function (err, target) {
            stringCallback(null, {
              key: stringObj.key,
              source: stringObj.value,
              target: target
            });
          });
        };
        async.map(stringsArray, processString, function (err, strings) {
          extensionCallback(null, {
            extension: row.dict_is_database ? "_database_" : row.ext_name || "_core_",
            strings: strings
          });

        });

      };
      async.map(res.rows, processExtension, function (err, extensions) {
        var output = {
          language: destinationLang || "",
          extensions: extensions
        };
        var exportFilename = path.join(__dirname, "../private",
          (destinationLang || "blank") + "_dictionary.js");
        console.log("Exporting to", exportFilename);
        fs.writeFile(exportFilename, JSON.stringify(output, undefined, 2), function (err, result) {
          masterCallback(err, result);
        });

      });
    });
  };

  exports.importDictionary = function (database, filename, masterCallback) {
    var creds = require("../../node-datasource/config").databaseServer;
    creds.database = database;

    filename = path.join(process.cwd(), filename);

    fs.readFile(filename, "utf8", function (err, contents) {
      if (err) {
        masterCallback(err);
        return;
      }
      var dictionary = JSON.parse(contents);
      var processExtension = function (extension, extensionCallback) {
        var context = extension.extension;
        var strings = _.reduce(extension.strings, function (memo, trans) {
          memo[trans.key] = trans.target;
          return memo;
        }, {});
        var sql = createQuery(strings, context, dictionary.language);

        dataSource.query(sql, creds, function (err, res) {
          extensionCallback(err, res);
        });
      };
      async.each(dictionary.extensions, processExtension, function (err, results) {
        masterCallback(err, results);
      });
    });


  };

}());
