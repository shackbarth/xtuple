
/**
*/

XT = {

  /**
    System precision scale for money.

    @static
    @constant
    @type Number
    @default 2
  */
  MONEY_SCALE: 2,

  /**
    System precision scale for quantity.

    @static
    @constant
    @type Number
    @default 6
  */
  QTY_SCALE: 6,

  /**
    System precision scale for quantity per.

    @static
    @constant
    @type Number
    @default 7
  */
  QTY_PER_SCALE: 7,

  /**
    System precision scale for costs.

    @static
    @constant
    @type Number
    @default 6
  */
  COST_SCALE: 6,

  /**
    System precision scale for sales prices.

    @static
    @constant
    @type Number
    @default 4
  */
  SALES_PRICE_SCALE: 4,

  /**
    System precision scale for purchase prices.

    @static
    @constant
    @type Number
    @default 6
  */
  PURCHASE_PRICE_SCALE: 6,

  /**
    System precision scale for extended prices.

    @static
    @constant
    @type Number
    @default 0
  */
  EXTENDED_PRICE_SCALE:4,

  /**
    System precision scale for unit conversion ratios.

    @static
    @constant
    @type Number
    @default 7
  */
  UNIT_RATIO_SCALE: 8,

  /**
    System precision scale for percentages.

    @static
    @constant
    @type Number
    @default 4
  */
  PERCENT_SCALE: 4,

  /**
    System precision scale for weight.

    @static
    @constant
    @type Number
    @default 2
  */
  WEIGHT_SCALE: 2,

  /**
    Maximum length of the history array

    @static
    @constant
    @type Number
    @default 20
   */
  HISTORY_MAX_LENGTH: 20

};

/**
*/
_.extend(XT,
  /** */ {

  /** */
  K: function (){},

  /** */
  _date: new Date(),

  /** */
  toReadableTimestamp: function (millis) {
    var re = XT._date || (XT._date = new Date());
    re.setTime(millis);
    return re.toLocaleTimeString();
  },

  getObjectByName: function (target) {

    if (!target.split) return null;

    var parts = target.split(".");
    var ret;
    var part;
    var idx = 0;
    for (; idx < parts.length; ++idx) {
      part = parts[idx];
      //console.log(part);
      //console.log(global[part]);
      ret = ret ? ret[part] : typeof window !== 'undefined' ? window[part] : global[part];
      //ret = ret? ret[part] : window[part];
      if (ret === null || ret === undefined) {
        return null;
      }
    }
    return ret;
  },

  /**
    @NOTE: some logic borrowed from SproutCore
  */
  A: function (obj) {
    if (obj === null || obj === undefined) return [];
    if (obj.slice instanceof Function) {
      if (typeof obj === "string") return [obj];
      else return obj.slice();
    }

    var ret = [];

    // case of function arguments that has length property
    if (obj.length) {
      var len = obj.length;
      while(--len >= 0) ret[len] = obj[len];
      return ret;
    }

    // for cases where we just convert the values from an
    // object to an array and discard the keys...
    return _.values(obj);
  }

});

XT.$A = XT.A;

_.extend(XT, {

  extensions: {},

  history: [],

  /**
    Save this in the history array. It's necessary to wait until
    we actually have the model returned so that we can give
    a nice title to the history item.

    @param {String} workspaceType
    @param {Object} model
    @param {Function} callback

   */
  addToHistory: function (workspaceType, model, callback) {
    //
    // We don't want to have duplicate entries in the history stack,
    // so delete any entry that's identical. We do this instead of
    // just not adding the new one, because we want the new one
    // to be at the top of the stack.
    //
    for (var i = 0; i < this.history.length; i++) {
      if (this.history[i].modelType === model.recordType &&
          this.history[i].modelId === model.get("id")) {
        this.history.splice(i, 1);
        i--;
      }
    }

    //
    // Unshift instead of push because we want the newest entries at the top
    //
    this.history.unshift({
      modelType: model.recordType,
      modelId: model.get("id"),
      modelName: model.getValue(model.nameAttribute),
      workspaceType: workspaceType
    });

    //
    // Preserve a maximum length of the history array based on a global constant
    // in XT
    //
    if (this.history.length > XT.HISTORY_MAX_LENGTH) {
      this.history = this.history.slice(0, XT.HISTORY_MAX_LENGTH);
    }




    if (callback) {
      callback(this.history);
    }
  },


  /**
   * Returns the history object
   */
  getHistory: function () {
    return this.history;
  }
});
