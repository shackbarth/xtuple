/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, Globalize:true */

(function () {
  "use strict";

  var _rateCache,
    _activeRequests = [];

  /**
    @class

    @extends XM.Document
  */
  XM.Currency = XM.Document.extend({
    /** @scope XM.Currency.prototype */

    recordType: 'XM.Currency',

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
      var that = this,
        checkOptions = {};

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

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:abbreviation', this.abbreviationDidChange);
    },

    /**
      Formats a value to a localized string.

      @param {Number} Value
      @returns {String}
    */
    format: function (value, scale) {
      scale = _.isUndefined(scale) ? 2 : scale;
      var previous = Globalize.culture().numberFormat.currency.symbol,
        symbol = this.get("symbol"),
        result;

      // Change current currency
      Globalize.culture().numberFormat.currency.symbol = symbol;

      // Format the value
      result = Globalize.format(value, "c" + scale);

      // Reset currency back to previous
      Globalize.culture().numberFormat.currency.symbol = previous;
      return result;
    },

    /**
      This version of `save` first checks to see if the abbreviation already
      exists before committing.
    */
    save: function (key, value, options) {
      var model = this,
        K = XM.Model,
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
        this.findExisting('abbreviation', currAbbr, checkOptions);

      // Otherwise just go ahead and save
      } else {
        XM.Document.prototype.save.call(model, key, value, options);
      }
    },

    /**
      Converts a value in the currency instance to base value via the success
      callback in options.

      @param {Number} Local value
      @param {Date} asOf
      @param {Object} Options
      @param {Function} [options.success] callback on successful response
      @returns {Object} Receiver
    */
    toBase: function (localValue, asOf, options) {
      options = options ? _.clone(options) : {};
      var that = this,
        rates = new XM.CurrencyRateCollection(),
        fetchOptions = {},
        baseValue,
        rate,
        params,
        err,
        request;

      // If invalid arguments, bail
      if (!this.id || !asOf || !options.success) { return this; }

      // If we're already the base currency, then just pass through
      if (this.get("isBase")) {
        options.success(localValue);
        return this;
      }

      // See if we already have the rate
      rate = _.find(_rateCache.models, function (rate) {
        var effective = rate.get("effective"),
          expires = rate.get("expires");
        return rate.id === that.id && XT.date.inRange(asOf, effective, expires);
      });

      // If we have conversion data already, use it
      if (rate) {
        baseValue = localValue / rate.get("rate");
        options.success(baseValue);

      // Otherwise, see if we already have a request out for this rate
      } else {
        request = _.find(_activeRequests, function (request) {
          return request.currency.id === that.id &&
            XT.date.compareDate(asOf, request.asOf) === 0;
        });

        // We've already asked for this, so add the callback
        // for this call to the list
        if (request) {
          request.callbacks.push({
            localValue: localValue,
            callback: options.success
          });

        // Otherwise, go get it
        } else {
          // Define the query
          fetchOptions.query = {
            parameters: [
              {
                attribute: "effective",
                operator: "<=",
                value: asOf
              },
              {
                attribute: "expires",
                operator: ">=",
                value: asOf
              },
              {
                attribute: "currency",
                operator: "=",
                value: this.id
              }
            ]
          };

          request = {
            currency: this,
            asOf: asOf,
            callbacks: [{
              value: localValue,
              callback: options.success
            }]
          };
          _activeRequests.push(request);

          // Define the results handler
          fetchOptions.success = function () {
            // If no results report an error
            if (!rates.length) {
              if (options.error) {
                params.currency = this.get("abbreviation");
                params.asOf = Globalize.format(asOf, "d");
                err = XT.Error.clone('xt2010', { params: params });
                options.error(err);
              }
              return;
            }
            rate = rates.at(0);

            // Cache rate for later use
            _rateCache.add(rate);

            // Forward result to callbacks
            _.each(request.callbacks, function (obj) {
              baseValue = obj.localValue / rate.get("rate");
              obj.callback(baseValue);
            });
          };

          // Make the request
          rates.fetch(fetchOptions);
        }
      }

      return this;
    },

    toString: function () {
      return this.get('abbreviation') + ' - ' + this.get('symbol');
    },

    validate: function (attributes) {
      var params = {};
      if (attributes.abbreviation &&
          attributes.abbreviation.length !== 3) {
        params.attr = "_abbreviation".loc();
        params.length = "3";
        return XT.Error.clone('xt1006', { params: params });
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    }

  });

  /**
    @class

    @extends XM.Document
  */
  XM.CurrencyRate = XM.Document.extend({
    /** @scope XM.CurrencyRate.prototype */

    recordType: 'XM.CurrencyRate'

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CurrencyCollection = XM.Collection.extend({
    /** @scope XM.CurrencyCollection.prototype */

    model: XM.Currency

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CurrencyRateCollection = XM.Collection.extend({
    /** @scope XM.CurrencyRateCollection.prototype */

    model: XM.CurrencyRate

  });

  _rateCache = new XM.CurrencyRateCollection();

}());
