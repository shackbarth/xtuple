/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, Backbone:true, _:true, console:true, setTimeout: true, locale:true */

(function () {
  "use strict";

  XT.localizeString = function (str) {
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
    return language;
  };

  // one-time-only: copy global object locale to XT.locale
  // this could be sidestepped if we load directly into
  // XT locale, perhaps by making this file an ejs view
  if (typeof locale !== 'undefined' && !XT.locale) {
    XT.locale = locale;
    _.each(locale.strings, function (hash) {
      XT.stringsFor(locale.culture, hash);
    });
  }

}());
