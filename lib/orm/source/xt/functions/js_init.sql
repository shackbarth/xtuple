drop function if exists xt.js_init();

create or replace function xt.js_init(debug boolean DEFAULT false) returns void as $$

  DEBUG = debug ? debug : false;

  if (plv8.version < '1.3.0'){
    plv8.elog(ERROR, 'plv8 version 1.3.0 or greater required. This version is = ', plv8.version);
  }


  // ..........................................................
  // METHODS
  //

  /**
    Return whether an array contains an item.

    @param {Any}
    @returns Boolean
  */
  Array.prototype.contains = function (item) {
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
  Array.prototype.indexOf = function (item) {
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
  Array.prototype.remove = function (item) {
    return this.contains(item) ? this.splice(this.indexOf(item), 1) : false;
  }

  /**
     Returns an the first item in an array with a property matching the passed value.

     @param {String} property name to search on
     @param {Any} value to search for
     @param Object item found or null
  */
  Array.prototype.findProperty = function (key, value) {
    for (var i = 0; i < this.length; i++) {
      for (var prop in this[i]) {
        if (prop === key &&
            this[i][prop] === value) {
          return this[i];
        }
      }
    }
    return false;
  }

  /**
    Curry function
  */
  Function.prototype.curry = function () {
    if (arguments.length < 1) {
        return this; /* nothing to curry with - return function */
    }

    var __method = this,
      args = arguments[0];

    return function () {
      return __method.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    }
  }

  handleError = function (message, code) {
    var err = new Error();
    this.stack = err.stack;
    this.name = "handleError";
    this.message = (message || "");
    this.code = code || null;
  }
  handleError.prototype = new Error();

  /**
    Return the text after the first dot.
  */
  String.prototype.afterDot = function () {
    return this.replace(/\w+\./i, '');
  }

  /**
    Return the text before the first dot.
  */
  String.prototype.beforeDot = function () {
    return this.replace(/\.\w+/i, '');
  }

  /**
     Trim whitespace from a string.
  */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,"");
  }

  /**
     Change sting with underscores '_' to camel case.

     @returns {String}
  */
  String.prototype.camelize = function () {
    var self = this,
        ret = self.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(self, separater, character) {
          return character ? character.toUpperCase() : '';
    });
    var first = ret.charAt(0),
      lower = first.toLowerCase();
    return first !== lower ? lower + ret.slice(1) : ret;
  };

  /**
     Change a camel case string to snake case.

     @returns {String} The argument modified
  */
  String.prototype.camelToHyphen = function () {
    return this.replace((/([a-z])([A-Z])/g), '$1-$2').toLowerCase();
  }

  /**
     Converts the string into a class name. This method will camelize
     your string and then capitalize the first letter.

     @returns {String}
  */
  String.prototype.classify = function () {
    return this.slice(0, 1).toUpperCase() + this.slice(1).camelize();
  }

  /**
     Change a camel case string to snake case.

     @returns {String} The argument modified
  */
  String.prototype.decamelize = function () {
    return this.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
  }

  /**
     Change a camelCase or ClassName string to capitalize the first letter and
     add space.

     @returns {String} The argument modified
  */
  String.prototype.humanize = function () {
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
    Change camel case property names in an object to hyphen case.
     Only changes immediate properties, it is not recursive.

     @param {Object | String} The object to decamelize
     @returns {Object | String} The argument modified
  */
  XT.camelToHyphen = function(obj) {
    var ret = {};
    if(typeof obj === "object") {
      for(var prop in obj) ret[prop.camelToHyphen()] = obj[prop];
    }
    else if(typeof obj === "string") return obj.camelToHyphen();
    return ret;
  }

  /**
   * Get current_database().
   */
  XT.currentDb = function() {
    return plv8.execute("select current_database() as db;")[0].db;
  }

  /**
   * Wrap plv8's elog DEBUG1.
   *
   * For debug messages to show up, you need to set your postgresql.conf to:
   * client_min_messages = debug1
   *
   * @param {String} Debug message of where you are at, what you are doing or what's in args.
   * @param {Object|Array} The data you want logged.
   */
  XT.debug = function(msg, args) {
    var message = '';

    msg = typeof msg === 'string' ? msg || 'debug data = ' : 'debug data = ';
    args = args || null;

    if (args) {
      message = JSON.stringify(args, null, 2);
    }

    // TODO, this could be changed to "LOG" and you would need to set: client_min_messages = log
    // Then you would not get any of the "RAISE DEBUG;" messages from the PL/pgSQL code.
    /* Do a hard trim to 900 so something prints. */
    plv8.elog(DEBUG1, (msg + message).substring(0, 900));
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
   * Wrap plv8's elog ERROR to include a stack trace and function arguments when debugging.
   *
   * @param {Object} The caught error object from a try/catch.
   * @param {Array} Javascript's arguments array for the function throwing the error.
   * @param {Boolean|String} Set flag to indicate the error was handled.
   */
  XT.error = function (error) {
    var message = error.stack + "\n";

    if (error.name === "handleError") {
      /* This error was handled and a message sent to the client. Those massages are*/
      /* generic HTTP codes. Send the stack trace with detailed info on what happened. */
      XT.debug(message);
      XT.message(error.code, error.message)
      throw "handledError";
    } else {
      /* Some times the stack trace can eat up the full 1000 char message. */
      /* Do a hard trim to 900 so something prints. */
      XT.message(500, "Internal Server Error");
      plv8.elog(WARNING, message.substring(0, 900));
      throw "unhandledError";
    }
  }

  /**
   * Wrap PostgreSQL's format() function to format SQL Injection safe queires or general strings.
   * http://www.postgresql.org/docs/9.1/interactive/functions-string.html#FUNCTIONS-STRING-OTHER
   *
   * Example: var query = XT.format("select * from %I", ["cntct"]);
   *  Returns: 'select * from cntct'
   * Example: var query = XT.format("select %1$I.* from %2$I.%1$I {join} where %1$I.%3$I = $1", ["contact", "xm", "id"]);
   *  Returns: 'select contact.* from xm.contact {join} where contact.number = $1'
   *
   * SQL Injection attemp:
   * Example: var query = XT.format("SELECT * FROM %I", ["cntct; select * from pg_roles; --"]);
   * Safely escaped/quoted query:
   *  Returns: 'SELECT * FROM "cntct; select * from pg_roles; --"'
   *
   * @param {String} The string with format tokens to replace.
   * @param {Array} An array of replacement strings.
   * @returns {String} Safely escaped string with tokens replaced.
   */
  XT.format = function (string, args) {
    if (typeof string !== 'string' || XT.typeOf(args) !== 'array' || !args.length) {
      return false;
    }

    var query = "select format($1",
        params = "";

    for(var i = 0; i < args.length; i++) {
      params = params + ", $" + (i + 2);
    }
    query = query + params + ")";

    /* Pass 'string' to format() as the first parameter. */
    args.unshift(string);

    if (DEBUG) {
      XT.debug('XT.format sql =', query);
      XT.debug('XT.format args =', args);
    }
    string = plv8.execute(query, args)[0].format;

    /* Remove 'string' from args to prevent reference errors. */
    args.shift();

    return string;
  };

  /**
    Return a universally unique identifier.

    We're using this solution:
    http://stackoverflow.com/a/8809472/251019
    From here:
    http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

    @return {String}
  */
  XT.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
    });

    return uuid;
  };

  XT.message = function (code, message) {
    var msg = {code: code, message: message};

    plv8.elog(INFO, JSON.stringify(msg));
    return 'Handled by XT.message';
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

  XT.extend = function(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  }

  // ..........................................................
  // PROCESS
  //

  var res, sql, path;

  /* put xt at the front of the search path */
  path = plv8.execute('select show_search_path() as path');
  path = path[0].path;
  plv8.execute('set search_path to xt,' + path);

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
        + 'order by js_ext, '
        + 'js_context = \'xtuple\' DESC';
    res = plv8.execute(sql);
    if(res.length) {
      for(var i = 0; i < res.length; i++) {
        if(DEBUG) XT.debug('loading javascript for type->', res[i].js_type);

        eval(res[i].javascript);
      }
    }
  }

$$ language plv8;

