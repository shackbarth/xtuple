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
    locale = require("../../lib/tools/source/locale"),
    path = require("path"),
    createQuery = function (strings, context, language) {
      return "select xt.set_dictionary($$%@$$, '%@', '%@');"
        .f(JSON.stringify(strings),
          context || "_core_",
          language || "en_US");
    };

  /**
    Looks (by convention) in en/strings.js of the extension for the
    English strings and asyncronously returns the sql command to put
    that hash into the database.
   */
  exports.getDictionarySql = function (extension, callback) {
    var isLibOrm = extension.indexOf("lib/orm") >= 0,
      isApplicationCore = extension.indexOf("enyo-client") >= 0 &&
        extension.indexOf("extension") < 0,
      clientHash,
      databaseHash,
      filename;

    if (!XT.stringsFor) {
      XT.getLanguage = locale.getLanguage;
      XT.stringsFor = locale.stringsFor;
    }
    if (isLibOrm) {
      // smash the tools and enyo-x strings together into one query
      clientHash = _.extend(
        require(path.join(extension, "../enyo-x/source/en/strings.js")).language.strings,
        require(path.join(extension, "../tools/source/en/strings.js")).language.strings
      );
      callback(null, createQuery(clientHash, "_framework_"));

    } else if (isApplicationCore) {
      // put the client strings into one query
      // put the database strings into another query
      clientHash = require(path.join(extension, "application/source/en/strings.js")).language.strings;
      databaseHash = require(path.join(extension, "database/source/en/strings.js")).language.strings;
      callback(null, createQuery(clientHash) + createQuery(databaseHash, "_database_"));

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


  //
  // The below code supports importing and exporting of dictionaries.
  // This functionality can be accessed through the command line via
  // the ./scripts/export_database.js and ./scripts/import_database.js
  // files.
  //

  var dataSource = require('../../node-datasource/lib/ext/datasource').dataSource;
  var querystring = require("querystring");
  var request = require("request");

  // Ask Google
  // note that if we haven't been given an API key then the control flow
  // will still come through here, but we'll just return the empty string
  // synchronously.
  var autoTranslate = function (text, apiKey, destinationLang, callback) {
    if (!apiKey || !destinationLang || !text) {
      // the user doesn't want to autotranslate
      callback(null, "");
      return;
    }

    if (destinationLang.indexOf("zh") === 0) {
      // Google uses the country code for chinese, but uses dashes instead of our underscores
      destinationLang = destinationLang.replace("_", "-");

    } else if (destinationLang.indexOf("_") >= 0) {
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

  //
  // Group similar english and foreign rows together
  // This will help us generate a dictionary file if there's
  // already a partway- or fully- implemented translation already
  // sitting in the database.
  //
  var marryLists = function (list) {
    var englishList = _.filter(list, function (row) {
      return row.dict_language_name === "en_US";
    });
    var foreignList = _.difference(list, englishList);
    var marriedList = _.map(englishList, function (englishRow) {
      var foreignRow = _.find(foreignList, function (foreignRow) {
        return foreignRow.ext_name === englishRow.ext_name &&
          foreignRow.dict_is_database === englishRow.dict_is_database &&
          foreignRow.dict_is_framework === englishRow.dict_is_framework;
      });
      return {
        source: englishRow,
        target: foreignRow
      };
    });
    return marriedList;
  };

  /**
    @param {String} database. The database name, such as "dev"
    @param {String} apiKey. Your Google Translate API key. Leave blank for no autotranslation
    @param {String} destinationLang. In form "es_MX".
    @param {Function} masterCallback
   */
  exports.exportEnglish = function (options, masterCallback) {
    var creds = require("../../node-datasource/config").databaseServer,
      sql = "select dict_strings, dict_is_database, dict_is_framework, " +
        "dict_language_name, ext_name from xt.dict " +
        "left join xt.ext on dict_ext_id = ext_id " +
        "where dict_language_name = 'en_US'",
      database = options.database,
      apiKey = options.apiKey,
      destinationDir = options.directory,
      destinationLang = options.language;

    if (destinationLang) {
      sql = sql + " or dict_language_name = $1";
      creds.parameters = [destinationLang];
    } // else the user wants a blank template, so no need to search for pre-existing translations
    sql = sql + ";";

    creds.database = database;
    dataSource.query(sql, creds, function (err, res) {
      var processExtension = function (rowMap, extensionCallback) {
        var row = rowMap.source;
        var foreignStrings = rowMap.target ? JSON.parse(rowMap.target.dict_strings) : [];
        var stringsArray = _.map(JSON.parse(row.dict_strings), function (value, key) {
          return {value: value, key: key};
        });
        var processString = function (stringObj, stringCallback) {
          //
          // If this translation has already been made into the target language, put that
          // translation into the dictionary file and do not bother autotranslating.
          //
          var preExistingTranslation = _.find(foreignStrings, function (foreignString, foreignKey) {
            return foreignString && foreignKey === stringObj.key;
          });
          if (preExistingTranslation) {
            // this has already been translated. No need to talk to Google etc.
            stringCallback(null, {
              key: stringObj.key,
              source: stringObj.value,
              target: preExistingTranslation
            });
          } else if ( destinationLang.indexOf('en') === 0 ) {
             // if locale is en_AU en_GB copy the en_US source: strings to target:
             stringCallback(null, {
               key: stringObj.key,
               source: stringObj.value,
               target: stringObj.value
             });
          } else {
            // ask google (or not)
            autoTranslate(stringObj.value, apiKey, destinationLang, function (err, target) {
              stringCallback(null, {
                key: stringObj.key,
                source: stringObj.value,
                target: target
              });
            });
         }
        };
        async.map(stringsArray, processString, function (err, strings) {
          extensionCallback(null, {
            extension: row.dict_is_database ? "_database_" :
              row.dict_is_framework ? "_framework_" :
              row.ext_name || "_core_",
            strings: strings
          });
        });
      };

      // group together english and foreign strings of the same extension
      var marriedRows = marryLists(res.rows);
      async.map(marriedRows, processExtension, function (err, extensions) {
        // sort alpha so as to keep diffs under control
        _.each(extensions, function (extension) {
          extension.strings = _.sortBy(extension.strings, function (stringObj) {
            return stringObj.key.toLowerCase();
          });
        });
        extensions = _.sortBy(extensions, function (extObj) {
          return extObj.extension;
        });

        var output = {
          language: destinationLang || "",
          extensions: extensions
        };
        // filename convention is ./scripts/output/es_MX_dictionary.js
        destinationDir = destinationDir || path.join(__dirname, "../output");

        var exportFilename = path.join(destinationDir,
          (destinationLang || "blank") + "_dictionary.js");
        console.log("Exporting to", exportFilename);
        fs.writeFile(exportFilename, JSON.stringify(output, undefined, 2), function (err, result) {
          masterCallback(err, result);
        });
      });
    });
  };

  /**
    Takes a dictionary definition file and inserts the data into the database
   */
  var importDictionary = exports.importDictionary = function (database, filename, masterCallback) {
    var creds = require("../../node-datasource/config").databaseServer;
    creds.database = database;

    filename = path.resolve(process.cwd(), filename);
    if (path.extname(filename) !== '.js') {
      console.log("Skipping non-dictionary file", filename);
      masterCallback();
      return;
    }
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

  exports.importAllDictionaries = function (database, callback) {
    var translationsDir = path.join(__dirname, "../../node_modules/xtuple-linguist/translations");
    if (!fs.existsSync(translationsDir)) {
      console.log("No translations directory found. Ignoring linguist.");
      return callback();
    }
    var importOne = function (dictionary, next) {
      importDictionary(database, dictionary, next);
    };
    var allDictionaries = _.map(fs.readdirSync(translationsDir), function (filename) {
      return path.join(translationsDir, filename);
    });
    async.map(allDictionaries, importOne, callback);
  };


}());
