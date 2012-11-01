create or replace function xt.js_init() returns void as $$

  DEBUG = false;

  // ..........................................................
  // METHODS
  //

  /**
    Return whether an array contains an item.

    @param {Any}
    @returns Boolean
  */
  Array.prototype.contains = function(item) {
    var i = this.length;
    while (i--) {
      if (this[i] === item) {
        return true;
      }
    }
    return false;
  }

  /**
    Return the index of an item in an array

    @param {Any}
    @returns Any
  */
  Array.prototype.indexOf = function(item) {
    var i = this.length;
    while (i--) {
      if (this[i] === item) {
        return i;
      }
    }
    return -1;
  }

  /**
    Remove an item from an array and return it.

    @param {Any}
    @returns Any
  */
  Array.prototype.remove = function(item) {
    return this.contains(item) ? this.splice(this.indexOf(item),1) : false;
  }

  /**
     Returns an the first item in an array with a property matching the passed value.

     @param {String} property name to search on
     @param {Any} value to search for
     @param Object item found or null
  */
  Array.prototype.findProperty = function(key, value) {
    for(var i = 0; i < this.length; i++) {
      for(var prop in this[i]) {
        if(prop === key &&
           this[i][prop] === value) {
             return this[i];
        }
      }
    }
    return false;
  }

  /**
    Return the text after the first dot.
  */
  String.prototype.afterDot = function() {
    return this.replace(/\w+\./i, '');
  }

  /**
    Return the text before the first dot.
  */
  String.prototype.beforeDot = function() {
    return this.replace(/\.\w+/i, '');
  }

  /**
     Trim whitespace from a string.
  */
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
  }

  /**
     Change sting with underscores '_' to camel case.

     @returns {String}
  */
  String.prototype.camelize = function() {
    var self = this,
        ret = self.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(self, separater, character) {
          return character ? character.toUpperCase() : '';
    });
    var first = ret.charAt(0),
        lower = first.toLowerCase();
    return first !== lower ? lower + ret.slice(1) : ret;
  };

  /**
     Converts the string into a class name. This method will camelize
     your string and then capitalize the first letter.

     @returns {String}
  */
  String.prototype.classify = function() {
    return this.slice(0,1).toUpperCase() + this.slice(1).camelize();
  }

  /**
     Change a camel case string to snake case.

     @returns {String} The argument modified
  */
  String.prototype.decamelize = function() {
    return this.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
  }

  /**
     Change a camelCase or ClassName string to capitalize the first letter and
     add space.

     @returns {String} The argument modified
  */
  String.prototype.humanize = function() {
    var spaced = this.replace((/([a-z])([A-Z])/g), '$1 $2');
    return human = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  // ..........................................................
  // XT
  //

  plv8.XT = XT = {};

  /**
     Change properties names on an object with underscores '_' to camel case.
     Only changes immediate properties, it is not recursive.

     @param {Object | String}
     @returns {Object | String}
  */
  XT.camelize = function(obj) {
    var ret = {};
    if(typeof obj === "object") {
      for(var prop in obj) {
        for(var prop in obj) ret[prop.camelize()] = obj[prop];
      }
    }
    else if(typeof obj === "string") return obj.camelize();
    return ret;
  }

  /**
    Change camel case property names in an object to snake case.
     Only changes immediate properties, it is not recursive.

     @param {Object | String} The object to decamelize
     @returns {Object | String} The argument modified
  */
  XT.decamelize = function(obj) {
    var ret = {};
    if(typeof obj === "object") {
      for(var prop in obj) ret[prop.decamelize()] = obj[prop];
    }
    else if(typeof obj === "string") return obj.decamelize();
    return ret;
  }

  /**
    Extended version of javascript 'typeof' that also recognizes arrays
  */
  XT.typeOf = function(value) {
    var str = typeof value;
    if (str === 'object') {
      if (value) {
        if (typeof value.length === 'number' &&
            !(value.propertyIsEnumerable('length')) &&
            typeof value.splice === 'function') {
          str = 'array';
        }
      } else str = 'null';
    }
    return str;
  }
  /**
  Register an action call that will yield an array of key value pairs of settings. This
  provides a way to develop a function call that can use these registrations to return
  all the settings in the system.

  @param {String} name space
  @param {String} type name
  @param {String} action name
  */
  XT.registerSettings = function(nameSpace, type, action) {
    var reg = {};
    if(!this._settingsreg) this._settingsreg = [];
    reg.nameSpace = nameSpace,
    reg.type = type,
    reg.action = action;
    this._settingsreg.push(reg);
  };

  /**
  Returns an array of settings registrations.

  @returns Array
  */
  XT.settingsRegistrations = function() {
    return this._settingsreg ? this._settingsreg : [];
  }

  // ..........................................................
  // PROCESS
  //

  var res, sql, path;

  /* create namespace objects for all registered javascript */
  sql = 'select distinct js_namespace as "nameSpace" '
        + 'from xt.js '
        + 'where js_active; '
  res = plv8.execute(sql);
  if(res.length) {
    for(var i = 0; i < res.length; i++) {
      if(!plv8[res[i].nameSpace]) {
        plv8[res[i].nameSpace] = eval([res[i].nameSpace] + " = {}");
      }
    }

    /* load up all active javascript installed in the database */
    /* TODO: What about dependencies? */
    sql = 'select js_type, js_text as "javascript" '
        + 'from xt.js '
        + 'where js_active '
        + 'order by js_ext ';
    res = plv8.execute(sql);
    if(res.length) {
      for(var i = 0; i < res.length; i++) {
        if(DEBUG) plv8.elog(NOTICE, 'loading javascript for type->', res[i].js_type);

        eval(res[i].javascript);
      }
    }
  }

$$ language plv8;

