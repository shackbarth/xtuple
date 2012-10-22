/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var exec = require("child_process").exec,
    stringFetcher = require("./strings");

  /**
    Creates a seed dictionary in JSON format based on the hardcoded keys
    and their English translation.

    @return {Object} seed JSON representation of default English dictionary
   */
  var getEnglishSeed = function () {
    var seed,
      key,
      value,
      lexicon = [],
      strings = stringFetcher.getStrings();

    for (key in strings) {
      value = strings[key];
      lexicon.push({"key": key, "translation": value});
    }

    seed = {
      "lexicon": lexicon,
      "languageName": "English",
      "languageVersion": 1,
      "xTupleVersion": "4.0"
    };
    return seed;
  };

  /**
    Creates a seed dictionary in JSON format based on the hardcoded keys
    and a blank translation, suitable to be filled in by a translator.

    @return {Object} seed JSON representation of blank dictionary
   */
  var getEmptySeed = function () {
    var seed,
      key,
      lexicon = [],
      strings = stringFetcher.getStrings();

    for (key in strings) {
      lexicon.push({"key": key, "translation": ""});
    }

    seed = {
      "lexicon": lexicon,
      "languageName": "",
      "languageVersion": 1,
      "xTupleVersion": ""
    };
    return seed;
  };

  /**
    Creates a mongoose dictionary instance from a JSON seed.

    @param {Object} seed The data in JSON format for this dictionary
    @return {X.DictionaryModel} dictionary The dictionary model.
   */
  var jsonToDictionaryInstance = function (seed) {
    var i,
      entry,
      DictionaryModel = X.dictionaryCache.model("Dictionary"),
      dictionaryInstance = new DictionaryModel(),
      DictionaryEntryModel = X.dictionaryCache.model("DictionaryEntry"),
      dictionaryEntryInstance,
      date = new Date(),
      translator = "xTuple Default",
      dictionaryEntryInstances = [];

    for (i = 0; i < seed.lexicon.length; i++) {
      entry = seed.lexicon[i];

      dictionaryEntryInstance = new DictionaryEntryModel();
      dictionaryEntryInstance.date = date;
      dictionaryEntryInstance.translator = translator;
      dictionaryEntryInstance.key = entry.key;
      dictionaryEntryInstance.translation = entry.translation;
      dictionaryEntryInstances.push(dictionaryEntryInstance);
    }
    dictionaryInstance.lexicon = dictionaryEntryInstances;
    dictionaryInstance.xTupleVersion = seed.xTupleVersion;
    dictionaryInstance.languageName = seed.languageName;
    dictionaryInstance.languageVersion = seed.languageVersion;
    //dictionaryInstance.translator = translator; // XXX don't think this is appropriate

    return dictionaryInstance;
  };

  /**
    Creates an English language dictionary from source and puts it
    into the database. This will only have to be run once each
    time the word set changes (like from one xTuple version to another)

   */
  var seedDatabase = function (callback) {
    var seed = this.getEnglishSeed(),
      dictionaryInstance = this.jsonToDictionaryInstance(seed);

    dictionaryInstance.save(callback);
  };

  exports.getEnglishSeed = getEnglishSeed;
  exports.getEmptySeed = getEmptySeed;
  exports.jsonToDictionaryInstance = jsonToDictionaryInstance;
  exports.seedDatabase = seedDatabase;

}());
