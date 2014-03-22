drop function if exists xt.js_init();

create or replace function xt.js_init(debug boolean DEFAULT false) returns void as $$

return (function () {

  if (plv8.__initialized && debug !== true) {
    return;
  }

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
    Remove duplicates from an array.

    @returns Array with no duplicates.
  */
  /* TODO: Or add underscore.js support. */
  Array.prototype.unique = function () {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
        if (typeof a[i] === 'string' && typeof a[j] === 'string') {
          if(a[i] === a[j]) {
            a.splice(j--, 1);
          }
        } else if (typeof a[i] === 'object' && typeof a[j] === 'object') {
          if(JSON.stringify(a[i]) === JSON.stringify(a[j])) {
            a.splice(j--, 1);
          }
        }
      }
    }

    return a;
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


  /* TODO: How can we send back a JSON object with error message and more info like 'foocol is required'. */
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

  /**
    Sets date to midnight of the current day.

    @returns Receiver
  */
  Date.prototype.toMidnight = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
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
    Returns today's date at midnight.
    returns {Date}
  */
  XT.today = function () {
    var today = new Date();
    return today.toMidnight();
  }

  /**
   * Wrap plv8's elog ERROR to include a stack trace and function arguments when debugging.
   *
   * @param {Object} The caught error object from a try/catch.
   * @param {Array} Javascript's arguments array for the function throwing the error.
   * @param {Boolean|String} Set flag to indicate the error was handled.
   */
  XT.error = function (error) {
    /* Make sure XT.username gets unset on errors. */
    XT.username = undefined;

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


  /*

    Start supporting functions for XT.executeFunction.

  */

  var errorMaps = [
    {"fromFunction":"closeAccountingYearPeriod","fromId":-1,"toFunction":"closeAccountingPeriod","toId":-1},
    {"fromFunction":"closeAccountingYearPeriod","fromId":-2,"toFunction":"closeAccountingPeriod","toId":-2},
    {"fromFunction":"closeAccountingYearPeriod","fromId":-3,"toFunction":"closeAccountingPeriod","toId":-3},
    {"fromFunction":"closeAccountingYearPeriod","fromId":-4,"toFunction":"closeAccountingPeriod","toId":-4},
    {"fromFunction":"closeAccountingYearPeriod","fromId":-5,"toFunction":"closeAccountingPeriod","toId":-5},
    {"fromFunction":"closeAccountingYearPeriod","fromId":-6,"toFunction":"closeAccountingPeriod","toId":-6},
    {"fromFunction":"convertCustomerToProspect","fromId":-1,"toFunction":"deleteCustomer","toId":-1},
    {"fromFunction":"convertCustomerToProspect","fromId":-2,"toFunction":"deleteCustomer","toId":-2},
    {"fromFunction":"convertCustomerToProspect","fromId":-3,"toFunction":"deleteCustomer","toId":-3},
    {"fromFunction":"convertCustomerToProspect","fromId":-4,"toFunction":"deleteCustomer","toId":-4},
    {"fromFunction":"convertCustomerToProspect","fromId":-5,"toFunction":"deleteCustomer","toId":-5},
    {"fromFunction":"convertProspectToCustomer","fromId":-1,"toFunction":"deleteProspect","toId":-1},
    {"fromFunction":"copyPrj","fromId":-10,"toFunction":"saveAlarm","toId":-10},
    {"fromFunction":"createARDebitMemo","fromId":-1,"toFunction":"createARCreditMemo","toId":-1},
    {"fromFunction":"deleteOpenRecurringItems","fromId":-1,"toFunction":"deleteIncident","toId":-1},
    {"fromFunction":"deleteOpenRecurringItems","fromId":-2,"toFunction":"deleteIncident","toId":-2},
    {"fromFunction":"enablePackage","fromId":-1,"toFunction":"disablePackage","toId":-1},
    {"fromFunction":"enablePackage","fromId":-2,"toFunction":"disablePackage","toId":-2},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-1,"toFunction":"issueToShipping","toId":-1},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-10,"toFunction":"issueToShipping","toId":-10},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-12,"toFunction":"issueToShipping","toId":-12},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-13,"toFunction":"issueToShipping","toId":-13},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-14,"toFunction":"issueToShipping","toId":-14},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-15,"toFunction":"issueToShipping","toId":-15},
    {"fromFunction":"issueAllBalanceToShipping","fromId":-20,"toFunction":"issueToShipping","toId":-20},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-1,"toFunction":"issueToShipping","toId":-1},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-10,"toFunction":"issueToShipping","toId":-10},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-12,"toFunction":"issueToShipping","toId":-12},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-13,"toFunction":"issueToShipping","toId":-13},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-14,"toFunction":"issueToShipping","toId":-14},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-15,"toFunction":"issueToShipping","toId":-15},
    {"fromFunction":"issueLineBalanceToShipping","fromId":-20,"toFunction":"issueToShipping","toId":-20},
    {"fromFunction":"issueToShipping","fromId":-1,"toFunction":"postInvTrans","toId":-1},
    {"fromFunction":"openAccountingYearPeriod","fromId":-1,"toFunction":"openAccountingPeriod","toId":-1},
    {"fromFunction":"postCCCashReceipt","fromId":-1,"toFunction":"createARCreditMemo","toId":-1},
    {"fromFunction":"postCCCashReceipt","fromId":-10,"toFunction":"postCCcredit","toId":-1},
    {"fromFunction":"postCountTagLocation","fromId":-1,"toFunction":"postCountTag","toId":-1},
    {"fromFunction":"postCountTagLocation","fromId":-2,"toFunction":"postCountTag","toId":-2},
    {"fromFunction":"postCountTagLocation","fromId":-3,"toFunction":"postCountTag","toId":-3},
    {"fromFunction":"postCountTagLocation","fromId":-4,"toFunction":"postCountTag","toId":-4},
    {"fromFunction":"postGLSeriesNoSumm","fromId":-4,"toFunction":"postGLSeries","toId":-4},
    {"fromFunction":"postGLSeriesNoSumm","fromId":-5,"toFunction":"postGLSeries","toId":-5},
    {"fromFunction":"postInvoice","fromId":-1,"toFunction":"insertIntoGLSeries","toId":-1},
    {"fromFunction":"postInvoice","fromId":-4,"toFunction":"insertIntoGLSeries","toId":-4},
    {"fromFunction":"postInvoice","fromId":-5,"toFunction":"postGLSeries","toId":-5},
    {"fromFunction":"postInvTrans","fromId":-3,"toFunction":"insertGLTransaction","toId":-3},
    {"fromFunction":"postInvTrans","fromId":-4,"toFunction":"insertGLTransaction","toId":-4},
    {"fromFunction":"postPoReceipt","fromId":-1,"toFunction":"postReceipt","toId":-1},
    {"fromFunction":"postPoReceipt","fromId":-2,"toFunction":"postReceipt","toId":-2},
    {"fromFunction":"postPoReceipt","fromId":-3,"toFunction":"postReceipt","toId":-3},
    {"fromFunction":"postPoReceipt","fromId":-4,"toFunction":"postReceipt","toId":-4},
    {"fromFunction":"postPoReceipt","fromId":-10,"toFunction":"postReceipt","toId":-10},
    {"fromFunction":"postPoReceipt","fromId":-11,"toFunction":"postReceipt","toId":-11},
    {"fromFunction":"postPoReceipt","fromId":-12,"toFunction":"postReceipt","toId":-12},
    {"fromFunction":"postReceipt","fromId":-1,"toFunction":"postInvTrans","toId":-1},
    {"fromFunction":"postReceipt","fromId":-2,"toFunction":"postInvTrans","toId":-2},
    {"fromFunction":"postReceipt","fromId":-3,"toFunction":"insertGLTransaction","toId":-3},
    {"fromFunction":"postReceipt","fromId":-4,"toFunction":"insertGLTransaction","toId":-4},
    {"fromFunction":"postReceipt","fromId":-20,"toFunction":"issueToShipping","toId":-1},
    {"fromFunction":"postReceipt","fromId":-21,"toFunction":"issueToShipping","toId":-10},
    {"fromFunction":"postReceipt","fromId":-22,"toFunction":"issueToShipping","toId":-12},
    {"fromFunction":"postReceipt","fromId":-23,"toFunction":"issueToShipping","toId":-13},
    {"fromFunction":"postReceipt","fromId":-24,"toFunction":"issueToShipping","toId":-14},
    {"fromFunction":"postReceipt","fromId":-25,"toFunction":"issueToShipping","toId":-15},
    {"fromFunction":"postReceipt","fromId":-26,"toFunction":"shipShipment","toId":-12},
    {"fromFunction":"postReceipt","fromId":-27,"toFunction":"shipShipment","toId":-13},
    {"fromFunction":"postReceipt","fromId":-28,"toFunction":"shipShipment","toId":-14},
    {"fromFunction":"postReceipt","fromId":-29,"toFunction":"shipShipment","toId":-15},
    {"fromFunction":"postReceipt","fromId":-30,"toFunction":"shipShipment","toId":-1},
    {"fromFunction":"postReceipt","fromId":-31,"toFunction":"shipShipment","toId":-3},
    {"fromFunction":"postReceipt","fromId":-32,"toFunction":"shipShipment","toId":-4},
    {"fromFunction":"postReceipt","fromId":-33,"toFunction":"shipShipment","toId":-5},
    {"fromFunction":"postReceipt","fromId":-34,"toFunction":"shipShipment","toId":-6},
    {"fromFunction":"postReceipt","fromId":-35,"toFunction":"shipShipment","toId":-8},
    {"fromFunction":"postReceipt","fromId":-36,"toFunction":"shipShipment","toId":-50},
    {"fromFunction":"postReceipt","fromId":-37,"toFunction":"shipShipment","toId":-99},
    {"fromFunction":"postPoReceipts","fromId":-1,"toFunction":"postPoReceipt","toId":-1},
    {"fromFunction":"postPoReceipts","fromId":-3,"toFunction":"postPoReceipt","toId":-3},
    {"fromFunction":"postPoReceipts","fromId":-4,"toFunction":"postPoReceipt","toId":-4},
    {"fromFunction":"postPoReceipts","fromId":-10,"toFunction":"postPoReceipt","toId":-10},
    {"fromFunction":"postPoReceipts","fromId":-12,"toFunction":"postPoReceipt","toId":-12},
    {"fromFunction":"postPoReturns","fromId":-1,"toFunction":"postInvTrans","toId":-1},
    {"fromFunction":"postPoReturns","fromId":-3,"toFunction":"insertGLTransaction","toId":-3},
    {"fromFunction":"postPoReturns","fromId":-4,"toFunction":"insertGLTransaction","toId":-4},
    {"fromFunction":"replaceAllVoidedChecks","fromId":-1,"toFunction":"replaceVoidedCheck","toId":-1},
    {"fromFunction":"returnItemShipments","fromId":-1,"toFunction":"postInvTrans","toId":-1},
    {"fromFunction":"shipShipment","fromId":-1,"toFunction":"postInvTrans","toId":-1},
    {"fromFunction":"shipShipment","fromId":-3,"toFunction":"insertGLTransaction","toId":-3},
    {"fromFunction":"shipShipment","fromId":-4,"toFunction":"insertGLTransaction","toId":-4},
    {"fromFunction":"splitRecurrence","fromId":-10,"toFunction":"createRecurringItems","toId":-10},
    {"fromFunction":"sufficientInventoryToShipOrder","fromId":-11,"toFunction":"sufficientInventoryToShipItem","toId":-11},
    {"fromFunction":"voidCreditMemo","fromId":-1,"toFunction":"insertIntoGLSeries","toId":-1},
    {"fromFunction":"voidCreditMemo","fromId":-4,"toFunction":"insertIntoGLSeries","toId":-4},
    {"fromFunction":"voidCreditMemo","fromId":-5,"toFunction":"postGLSeries","toId":-5},
    {"fromFunction":"voidInvoice","fromId":-1,"toFunction":"insertIntoGLSeries","toId":-1},
    {"fromFunction":"voidInvoice","fromId":-4,"toFunction":"insertIntoGLSeries","toId":-4},
    {"fromFunction":"voidInvoice","fromId":-5,"toFunction":"postGLSeries","toId":-5},
    {"fromFunction":"reserveSoLineBalance","fromId":-1,"toFunction":"reserveSoLineQty","toId":-1},
    {"fromFunction":"reserveSoLineBalance","fromId":-2,"toFunction":"reserveSoLineQty","toId":-2},
    {"fromFunction":"reserveSoLineBalance","fromId":-3,"toFunction":"reserveSoLineQty","toId":-3},
    {"fromFunction":"woClockIn","fromId":-1,"toFunction":"explodeWo","toId":-1},
    {"fromFunction":"woClockIn","fromId":-2,"toFunction":"explodeWo","toId":-2},
    {"fromFunction":"woClockIn","fromId":-3,"toFunction":"explodeWo","toId":-3}
  ];

  XT.getUserCulture = function() {
    var sql = "select lang_abbr2 || '_' || country_abbr as \"culture\" " +
      "from locale " +
      "join usr on usr_locale_id = locale_id " +
      "left join lang on locale_lang_id = lang_id " +
      "left join country on locale_country_id = country_id " +
      "where usr_username = $1;";
    return plv8.execute(sql, [XT.username])[0].culture;
  };

  XT.errorToString = function(functionName, errorCode, params) {
    params = params || [];
    var culture,
      dictSql,
      dictResult,
      errorMap = [true],
      stringsKey,
      i = 1;

    /* Trace the error code down to the underlying error based on our errorMap */
    while (errorMap.length) {
      errorMap = errorMaps.filter(function (errorMap) {
        return errorMap.fromFunction === functionName && errorMap.fromId === errorCode;
      });
      if (errorMap.length) {
        functionName = errorMap[0].toFunction;
        errorCode = errorMap[0].toId;
      }
    }

    /* cache the strings in JSON in XT.dbStrings */
    XT.dbStrings = XT.dbStrings || {};
    culture = XT.getUserCulture();
    if(!XT.dbStrings[culture]) {
      /* need to load in the strings for this culture into the database */
      dictSql = "select dict_strings from xt.dict where dict_is_database = true and dict_language_name = $1;";
      dictResult = plv8.execute(dictSql, [culture]);
      XT.dbStrings[culture] = JSON.parse(dictResult[0].dict_strings.toLowerCase());
    }
    /* this is the convention under which the translations are stored */
    stringsKey = "_xtdb_" + functionName + (-1 * errorCode);

    var returnVal = XT.dbStrings[culture][stringsKey.toLowerCase()];

    /* Replace parameters if applicable */
    params.forEach(function(param) {
      returnVal = returnVal.replace("%" + i, param);
      i++;
    })

    return returnVal || "Undocumented error: " + functionName + " " + errorCode;
  };

  /**
    Wrapper for plv8.execute() for calling postgres functions.
    If the postgres function returns an error in the form of
    a negative integer, this function finds the appropriate
    translation and throws that error.

    NOTE that you should not pass unsanitized user input into
    the functionName or the casts variables.

    @param {String} functionName.
    @param {Array} params
    @param {Array} casts. Optional. Array of strings
   */
  XT.executeFunction = function (functionName, params, casts) {
    params = params || [];
    var cast,
      errorString,
      i;

    var sql = "select " + functionName + "(";
    for (i = 0; i < params.length; i++) {
      cast = casts && casts[i];
      if (i > 0) {
        sql = sql + ",";
      }
      sql = sql + "$" + (i + 1);
      if(cast) {
        sql = sql + "::" + cast;
      }

    }
    sql = sql + ") as result";

    if (DEBUG) {
      XT.debug('sql =', sql);
      XT.debug('params =', params);
    }
    var result = plv8.execute(sql, params)[0].result;
    if(typeof result === 'number' && result < 0) {
      errorString = XT.errorToString(functionName, result);
      throw new handleError(errorString, 424);
    } else {
      return result;
    }
  };


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

    /*
    if (DEBUG) {
      XT.debug('XT.format sql =', query);
      XT.debug('XT.format args =', args);
    }
    */
    string = plv8.execute(query, args)[0].format;

    /* Remove 'string' from args to prevent reference errors. */
    args.shift();

    return string;
  };

  /**
   * Wrap formatDate()
   *
   * @param Object The date.
   * @returns {String} Date string in user's locale.
  */
  XT.formatDate = function (string) {
    var query = "select formatdate($1);"
    if (DEBUG) {
      XT.debug('XT.formatDate sql =', query);
      XT.debug('XT.formatDate arg =', string);
    }
    ret = plv8.execute(query, [string])[0];
    return ret;
  };

  /**
   * Wrap formatCost()
   *
   * @param Number The cost.
   * @returns {Number} Cost number in user's locale & scale.
  */
  XT.formatCost = function (numb) {
    var query = "select formatcost($1);"
    if (DEBUG) {
      XT.debug('XT.formatCost sql =', query);
      XT.debug('XT.formatCost arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatMoney()
   *
   * @param Number The money.
   * @returns {Number} Money in user's locale & scale.
  */
  XT.formatMoney = function (numb) {
    var query = "select formatmoney($1);"
    if (DEBUG) {
      XT.debug('XT.formatMoney sql =', query);
      XT.debug('XT.formatMoney arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatSalesPrice()
   *
   * @param Number The price.
   * @returns {Number} Price in user's locale & scale.
  */
  XT.formatSalesPrice = function (numb) {
    var query = "select formatsalesprice($1);"
    if (DEBUG) {
      XT.debug('XT.formatSalesPrice sql =', query);
      XT.debug('XT.formatSalesPrice arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatPurchPrice()
   *
   * @param Number The price.
   * @returns {Number} Price in user's locale & scale.
  */
  XT.formatPurchPrice = function (numb) {
    var query = "select formatpurchprice($1);"
    if (DEBUG) {
      XT.debug('XT.formatPurchPrice sql =', query);
      XT.debug('XT.formatPurchPrice arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatExtPrice()
   *
   * @param Number The price.
   * @returns {Number} Price in user's locale & scale.
  */
  XT.formatExtPrice = function (numb) {
    var query = "select formatExtPrice($1);"
    if (DEBUG) {
      XT.debug('XT.formatExtPrice sql =', query);
      XT.debug('XT.formatExtPrice arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatQty()
   *
   * @param Number The quantity.
   * @returns {Number} Quantity in user's locale & scale.
  */
  XT.formatQty = function (numb) {
    var query = "select formatqty($1);"
    if (DEBUG) {
      XT.debug('XT.formatQty sql =', query);
      XT.debug('XT.formatQty arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatQtyPer()
   *
   * @param Number The quantity per.
   * @returns {Number} Quantity per in user's locale & scale.
  */
  XT.formatQtyPer = function (numb) {
    var query = "select formatqtyper($1);"
    if (DEBUG) {
      XT.debug('XT.formatQtyPer sql =', query);
      XT.debug('XT.formatQtyPer arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatRatio()
   *
   * @param Number The ratio.
   * @returns {Number} Ratio in user's locale & scale.
  */
  XT.formatRatio = function (numb) {
    var query = "select formatRatio($1);"
    if (DEBUG) {
      XT.debug('XT.formatRatio sql =', query);
      XT.debug('XT.formatRatio arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatPrcnt()
   *
   * @param Number The percent.
   * @returns {Number} Percent in user's locale & scale.
  */
  XT.formatPrcnt = function (numb) {
    var query = "select formatprcnt($1);"
    if (DEBUG) {
      XT.debug('XT.formatPrcnt sql =', query);
      XT.debug('XT.formatPrcnt arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatWeight()
   *
   * @param Number The weight.
   * @returns {Number} Weight in user's locale & scale.
  */
  XT.formatWeight = function (numb) {
    var query = "select formatweight($1);"
    if (DEBUG) {
      XT.debug('XT.formatWeight sql =', query);
      XT.debug('XT.formatWeight arg =', numb);
    }
    ret = plv8.execute(query, [numb])[0];
    return ret;
  };

  /**
   * Wrap formatNumeric()
   *
   * @param Number.
   * @returns {Number} Number in user's locale & scale.
  */
  XT.formatNumeric = function (numb, text) {
    var query = "select formatNumeric($1, $2);"
    if (DEBUG) {
      XT.debug('XT.formatNumeric sql =', query);
      XT.debug('XT.formatNumeric arg1 =', numb);
      XT.debug('XT.formatNumeric arg2 =', text);
    }
    ret = plv8.execute(query, [numb, text])[0];
    return ret;
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

        var ns = eval(res[i].js_namespace);
        if (ns && ns[js_type]) {
          if (Object.isFrozen(ns[js_type])) {
            plv8.elog(WARNING, 'object already frozen: '+ ns + '.' + js_type);
          }
          Object.freeze(ns[js_type]);
        }
      }
    }
    plv8.__initialized = true;
  }

}());

$$ language plv8;
