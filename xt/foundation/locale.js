
XT.Locale = enyo.kind({
  kind: "Component",
  published: {
    hasStrings: false,
    strings: null
  },
  create: function() {
    this.inherited(arguments);
    this.strings = {};
  }
});

enyo.mixin(XT.Locale, {
  addStrings: function(stringsHash) {
    var strings = this.prototype.strings;
    if (strings) {
      if (!this.prototype.hasOwnProperty('strings')) {
        this.prototype.strings = enyo.copy(strings);
      }
    } else { this.prototype.strings = {}; }
    if (stringsHash) {
      this.prototype.strings = enyo.mixin(strings, stringsHash);
      this.prototype.hasStrings = true;
    }
  }
});

XT.stringsFor = function(lang, stringsHash) {
  
};