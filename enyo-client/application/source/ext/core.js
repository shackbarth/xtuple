/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, io:true, Backbone:true, _:true, console:true, enyo:true */

(function () {
  "use strict";

  var baseCurr;

  _.extend(XT, {

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
      @default 2
    */
    EXTENDED_PRICE_SCALE: 2,

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
      System precision scale for hours.

      @static
      @constant
      @type Number
      @default 2
    */
    HOURS_SCALE: 2,

    /**
      Maximum length of the history array

      @static
      @constant
      @type Number
      @default 20
     */
    HISTORY_MAX_LENGTH: 20,

    HELP_URL_ROOT: "https://www.xtuple.org/faq/xtuple-mobile/",

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
            this.history[i].modelId === model.get(model.idAttribute)) {
          this.history.splice(i, 1);
          i--;
        }
      }

      //
      // Unshift instead of push because we want the newest entries at the top
      //
      this.history.unshift({
        modelType: model.recordType,
        modelId: model.get(model.idAttribute),
        modelName: model.getValue(model.nameAttribute) || model.get(model.idAttribute),
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

    baseCurrency: function () {
      if (baseCurr) { return baseCurr; }
      baseCurr = XM.currencies ? _.find(XM.currencies.models, function (curr) {
        return curr.get('isBase');
      }) : false;
      
      return baseCurr;
    },

    /**
      Returns the default site if profiled, otherwise returns
      the first alpha active selling site
    */
    defaultSite: function () {
      var preferredSite = XT.session.preferences.get("PreferredWarehouse"),
        foundSite;

      if (preferredSite) {
        foundSite = _.find(XM.siteRelations.models, function (site) {
          return site.get("code") === preferredSite;
        });
      }

      if (!foundSite) {
        // either there is no preference or the preference is miswired somehow
        foundSite = _.find(XM.siteRelations.models, function (site) {
          return site.get("isActive");
        });
      }

      return foundSite;
    },

    /**
     * Returns the history object
     */
    getHistory: function () {
      return this.history;
    },

    toMoney: function (value) {
      return XT.math.round(value, XT.MONEY_SCALE);
    },

    toQuantity: function (value) {
      return XT.math.round(value, XT.QTY_SCALE);
    },

    toQuantityPer: function (value) {
      return XT.math.round(value, XT.QTY_PER_SCALE);
    },

    toCost: function (value) {
      return XT.math.round(value, XT.COST_SCALE);
    },

    toSalesPrice: function (value) {
      return XT.math.round(value, XT.SALES_PRICE_SCALE);
    },

    toPurchasePrice: function (value) {
      return XT.math.round(value, XT.PURCHASE_PRICE_SCALE);
    },

    toExtendedPrice: function (value) {
      return XT.math.round(value, XT.EXTENDED_PRICE_SCALE);
    },

    toUnitRatio: function (value) {
      return XT.math.round(value, XT.UNIT_RATIO_SCALE);
    },

    toPercent: function (value) {
      // Models store percent as decimal, so add two
      return XT.math.round(value, XT.PERCENT_SCALE + 2);
    },

    toWeight: function (value) {
      return XT.math.round(value, XT.WEIGHT_SCALE);
    }

  });

}());
