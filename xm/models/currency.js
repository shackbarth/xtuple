/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XM.Document
  */
  XM.Currency = XM.Document.extend({
    /** @scope XM.Currency.prototype */

    recordType: 'XM.Currency',

    privileges: {
      "all": {
        "create": "CreateNewCurrency",
        "read": true,
        "update": "MaintainCurrencies",
        "delete": "MaintainCurrencies"
      }
    },

    documentKey: 'name',

    enforceUpperKey: false,

    defaults: {
      isBase: false
    },

    requiredAttributes: [
      'abbreviation',
      'isBase',
      'name',
      'symbol'
    ],

    // ..........................................................
    // METHODS
    //

    abbreviationDidChange: function (model, value, options) {
      var K = XT.Model,
        that = this,
        status = this.getStatus(),
        checkOptions = {};
      if ((options && options.force) || !(status & K.READY)) { return; }

      checkOptions.success = function (resp) {
        var err, params = {};
        if (resp) {
          params.attr = "_abbreviation".loc();
          params.value = value;
          err = XT.Error.clone('xt1008', { params: params });
          that.trigger('error', that, err, options);
        }
      };
      this.findExisting('abbreviation', value, checkOptions);
    },

    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:abbreviation', this.abbreviationDidChange);
    },

    /**
      This version of `save` first checks to see if the abbreviation already
      exists before committing.
    */
    save: function (key, value, options) {
      var model = this,
        K = XT.Model,
        currAbbr = this.get('abbreviation'),
        origAbbr = this.original('abbreviation'),
        status = this.getStatus(),
        checkOptions = {};

      // Check for number conflicts if we should
      if (status === K.READY_NEW ||
          (status === K.READY_DIRTY && currAbbr !== origAbbr)) {
        checkOptions.success = function (resp) {
          var err, params = {};
          if (resp === 0) {
            XM.Document.prototype.save.call(model, key, value, options);
          } else {
            params.attr = "_abbreviation".loc();
            params.value = currAbbr;
            err = XT.Error.clone('xt1008', { params: params });
            model.trigger('error', model, err, options);
          }
        };
        checkOptions.error = Backbone.wrapError(null, model, options);
        this.findExisting('abbreviation', currAbbr, checkOptions);

      // Otherwise just go ahead and save
      } else {
        XM.Document.prototype.save.call(model, key, value, options);
      }
    },

    toString: function () {
      return this.get('abbreviation') + ' - ' + this.get('symbol');
    },

    validateEdit: function (attributes) {
      var params = {};
      if (attributes.abbreviation &&
          attributes.abbreviation.length !== 3) {
        params.attr = "_abbreviation".loc();
        params.length = "3";
        return XT.Error.clone('xt1006', { params: params });
      }
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
  
    @extends XT.Collection
  */
  XM.CurrencyCollection = XT.Collection.extend({
    /** @scope XM.CurrencyCollection.prototype */

    model: XM.Currency

  });

}());