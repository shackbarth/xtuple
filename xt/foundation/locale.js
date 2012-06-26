
//...........................................
// THE FOLLOWING IMPLEMENTATION IS VERY TEMPORARY
// FOR DEVELOPMENT PURPOSES ONLY!
XT.Locale = enyo.kind({
  kind: "Component",
  published: {
    hasStrings: false,
    strings: null,
    lang: ""
  },
  create: function() {
    this.inherited(arguments);
    this.strings = {};
  },
  setLanguage: function(language) {
    if (this.getHasStrings()) {
      return this.warn("attempt to set a new language");
    }
    this.setLang(language.lang? language.lang: "en");
    this.setStrings(language.strings? language.strings: {});
  },
  stringsChanged: function() {
    var strings = this.getStrings();
    if (strings && strings instanceof Object && Object.keys(strings).length > 0) {
      this.setHasStrings(true);
    } else { this.error("something is amiss"); }
  },
  loc: function(str) {
    var strings = this.getStrings();
    return strings[str]? strings[str]: str.toString();
  }
});

XT.stringsFor = function(lang, stringsHash) {
  if (!XT.lang) {
    XT.lang = {
      lang: lang,
      strings: stringsHash
    };
  } else {
    enyo.log("XT.stringsFor(): request to write over current language");
  }
};