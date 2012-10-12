/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, Backbone:true, _:true, console:true, setTimeout: true */

(function () {
  "use strict";

  //...........................................
  // THE FOLLOWING IMPLEMENTATION IS VERY TEMPORARY
  // FOR DEVELOPMENT PURPOSES ONLY!
  XT.locale = {
    hasStrings: false,
    strings: {},
    lang: "",

    getHasStrings: function () {
      return this.hasStrings;
    },

    getLang: function () {
      return this.lang;
    },

    getStrings: function () {
      return this.strings;
    },

    setHasStrings: function (value) {
      this.hasStrings = value;
      return this;
    },

    setLang: function (value) {
      this.lang = value;
      return this;
    },

    setStrings: function (value) {
      this.strings = value;
      return this;
    },

    setLanguage: function (language) {
      if (typeof language === 'string') {
        language = XT.getLanguage(language) || {};
      }
      this.setLang(language.lang || "en");
      this.setStrings(language.strings || {});
    },

    stringsChanged: function () {
      var strings = this.getStrings();
      if (strings && strings instanceof Object && Object.keys(strings).length > 0) {
        this.setHasStrings(true);
      } else { this.error("something is amiss"); }
    },

    loc: function (str) {
      var strings = this.getStrings();
      return strings[str] || str.toString();
    }

  };
  
  XT.getLanguage = function (lang) {
    return _.find(XT.languages, function (obj) {
      return obj.lang === lang;
    });
  };

  XT.stringsFor = function (lang, stringsHash) {
    var language;
    if (!XT.languages) { XT.languages = []; }
    language = XT.getLanguage(lang);
    if (language) {
      language.strings = _.extend(language.strings, stringsHash);
    } else {
      language = {
        lang: lang,
        strings: stringsHash
      };
      XT.languages.push(language);
    }
    return language;
  };

}());
