
XT.String = {

  /**
     Change sting with underscores '_' to camel case.

     @returns {String}
  */
  camelize: function (str) {
    var ret = str.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function (str, separater, character) {
          return character ? character.toUpperCase() : '';
    });
    var first = ret.charAt(0),
        lower = first.toLowerCase();
    return first !== lower ? lower + ret.slice(1) : ret;
  },

  /**
   * Change a camel case string to snake case.
   *
   * @returns {String} The argument modified
   */
  decamelize: function (str) {
    return str.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
  },

  /**
   * Change a camel case string to hyphen case.
   *
   * @returns {String} The argument modified
   */
  camelToHyphen: function (str) {
    return str.replace((/([a-z])([A-Z])/g), "$1-$2").toLowerCase();
  },

  /**
    Localize the string.
  */
  loc: function (str) {
    var args = XT.$A(arguments);
    var localized = XT.localizeString(str);

    args.shift();

    if (args.length > 0) {
      try {
        return XT.String.format(localized, args);
      } catch(err) {
        XT.error("could not localize string, %@".f(str), err);
      }
    } else { return localized; }
  },

  /**
    @NOTE: does not currently detect recursion depth...
  */
  format: function (str, args) {
    if (arguments.length === 0) return "";
    if (arguments.length === 1) return str;

    var idx = 0;
    var type;
    var arg;

    for (; idx < args.length; ++idx) {
      arg = args[idx];
      if (!arg) continue;
      type = typeof arg;
      if (type === "object") {
        str = XT.String.replaceKeys(str, arg);
      } else if (type === "string" || type === "number") {
        str = str.replace(/\%@/, arg);
      } else { continue; }
    }

    return str;
  },

  formatBraces: function (data, str) {
    str = str || "";
    var parser = /\{([^}]+)\}/g, // Finds curly braces
      that = this,
      tokens,
      attr;
    tokens = str.match(parser);
    _.each(tokens, function (token) {
      attr = token.slice(1, token.indexOf('}'));
      str = str.replace(token, that.traverseDots(data, attr));
    });
    return str;
  },

  replaceKeys: function (str, hash) {
    if (typeof str !== "string") return "";
    if (typeof hash !== "object") return str;

    var regex;
    var key;
    var expr;
    var value;

    for (key in hash) {
      if (hash.hasOwnProperty(key)) {
        expr = "{" + key + "}";
        regex = new RegExp(expr, "g");
        value = hash[key];
        str = str.replace(regex, value);
      }
    }

    return str;
  },

  /**
    Akin to getValue() on a model.
   */
  traverseDots: function (data, key) {
    while (key.indexOf(".") >= 0) {
      data = data[this.prefix(key)];
      key = key.substring(key.indexOf(".") + 1);
    }
    return data[key];
  },

  trim: function trim(str) {
    if (!str || !(str instanceof String)) return "";
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },


  /**
    Returns everything before the first dot.
    TODO: regex would be more efficient
  */
  prefix: function (value) {
    value = value.substring(0, value.indexOf("."));
    return value;
  },

  /**
    Returns everything after the last dot.
    TODO: regex would be more efficient
  */
  suffix: function (value) {
    while (value.indexOf(".") > 0) {
      // strip off the prefix (everything before the dot) if there is one
      value = value.substring(value.indexOf(".") + 1);
    }
    return value.substring(0);
  },

  /**
    Pads left
  */
  leftPad: function (str, padString, length) {
    while (str.length < length)
        str = padString + str;
    return str;
  },

  /**
    Pads right
  */
  rightPad: function (str, padString, length) {
    while (str.length < length)
        str = str + padString;
    return str;
  }

};
