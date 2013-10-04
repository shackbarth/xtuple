/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, Backbone:true, _:true, exports:true  */

(function () {
  "use strict";

  XT.localizeString = function (str) {
    if (!XT.locale || !XT.getLanguage(XT.locale.culture)) {
      return str.toString();
    }
    var strings = XT.getLanguage(XT.locale.culture).strings;
    return strings[str] || str.toString();
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
    return {
      lang: lang,
      strings: stringsHash
    };
  };

  if (typeof exports !== 'undefined') {
    exports.getLanguage = XT.getLanguage;
    exports.stringsFor = XT.stringsFor;
  }

  // one-time-only: copy locale strings into the languages
  // variable, where they can get accessed by the app
  if (!XT.languages && XT.locale && XT.locale.strings) {
    _.each(XT.locale.strings, function (hash) {
      XT.stringsFor(XT.locale.culture, hash);
    });
  }
}());
