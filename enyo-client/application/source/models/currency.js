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

    idAttribute: 'abbreviation',
    documentKey: 'abbreviation',

    enforceUpperKey: false,

    defaults: {
      isBase: false
    },

    readOnlyAttributes: [
      "isBase",
    ],    

    handlers: {
      "status:READY_CLEAN": "statusReadyClean"
    },

    // ..........................................................
    // METHODS
    //

    nameDidChange: function (model, value, options) {
      var that = this,
        checkOptions = {};

      checkOptions.success = function (resp) {
        var err, params = {};
        if (resp) {
          params.attr = "_name".loc();
          params.value = value;
          err = XT.Error.clone('xt1008', { params: params });
          that.trigger('error', that, err, options);
        }
      };
      this.findExisting('name', value, checkOptions);
    },

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:name', this.nameDidChange);
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
            model.trigger('invalid', model, err, options);
          }
        };
        this.findExisting('abbreviation', currAbbr, checkOptions);

      // Otherwise just go ahead and save
      } else {
        XM.Document.prototype.save.call(model, key, value, options);
      }
    },

    statusReadyClean: function () {
      // If there is no Base currency set, make it not readOnly
      var coll = this.collection,
        hasBase;

      if (coll && coll.models) {
        hasBase = _.find(coll.models, function (model) {
          return model.get("isBase") === true;
        });
      } 

      this.setReadOnly("isBase", hasBase);
    },

    /**
     * Converts this currency to another via the base currency. The
     * options.success callback is NOT optional.
     *
     * @param {XM.Currency} target currency
     * @param {Number} value of the currency
     * @param {Date} asof
     * @param {Object} Options
     * @param {Function} [options.success] callback on successful response
     * @returns {Object} Receiver
     *
     * @see XM.Currency#toBase
     * @see XM.Currency#fromBase
     * @callback options.success
     */
    toCurrency: function (targetCurrency, value, asof, options) {
      /**
       * If we're supposed to 'convert' to the same currency or using a money
       * value of zero, just pass back the given value.
       */
      if (this.id === targetCurrency.id || value === 0) {
        options.success(value);
        return this;
      }

      var that = this,
        onRatesSuccess,
        plan = [
          {
            currency: this,
            rate: XM.currencyRates.getScalarRate('to base from', this, asof)
          },
          {
            currency: targetCurrency,
            rate: XM.currencyRates.getScalarRate('from base to', targetCurrency, asof)
          }
        ],

        /**
         * Compute the value of the target currency.
         */
        targetValue = _.reduce(plan, function (value, step) {
          return value * step.rate;
        }, value),

        /**
         * Invoked if valid currency rates cannot be found.
         */
        onRatesError = function () {
          if (_.isFunction(options.error)) {
            options.error();
          }
        };

      /**
       * If targetValue is a valid number, then pass it to the callback and
       * return.
       */
      if (!_.isNaN(targetValue)) {
        options.success(targetValue);
        return this;
      }
      else if (options.cacheOnly) {
        onRatesError();
        return this;
      }

      /**
       * At this point, we could not find one or both of the currency
       * conversion rates in the cache, so we have to query the server.
       *
       * @callback
       * When both rates are fetched into the global rate cache, make another
       * call to toCurrency.
       */
      onRatesSuccess = function () {
        that.toCurrency(
          targetCurrency,
          value,
          asof,
          _.extend(options, { cacheOnly: true })
        );
      };

      /**
       * Query for the absent rates and store the result in the rate cache.
       */
      XM.currencyRates.add(_.pluck(plan, 'currency'));
      XM.currencyRates.fetch({
        query: _.clone(XM.CurrencyRate.buildQuery(asof)), // XXX forgot why I cloned this...
        success: function (collection) {
          if (collection.length > 0) {
            return onRatesSuccess();
          }
          onRatesError();
        },
        error: onRatesError
      });

      return this;
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
      options = _.extend({ }, options);
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
        // it would be nice if we could compare the rate against the rate here, but
        // given that we're in a model that only knows the currency id as its id, we
        // have to compare the CURRENCY of the rate against that.id, and then
        // perform the effective date filter as well.
        return rate.get("currency") === that.id &&
          XT.date.inRange(asOf, effective, expires);
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
              localValue: localValue,
              callback: options.success
            }]
          };
          _activeRequests.push(request);

          // Define the results handler
          fetchOptions.success = function () {

            // Remove from active requests
            _activeRequests = _.filter(_activeRequests, function (request) {
              return request.currency.id !== that.id ||
                XT.date.compareDate(asOf, request.asOf) !== 0;
            });

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

          fetchOptions.error = function () {
            XT.log("Fetch rate failed in toBase in Currency");
          };

          // Make the request
          rates.fetch(fetchOptions);
        }
      }

      return this;
    },

    /**
       Converts a value in the currency instance to a local value via the success
       callback in options.

       @param {Number} base value
       @param {Date} asOf
       @param {Object} Options
       @param {Function} [options.success] callback on successful response
       @returns {Object} Receiver
     */
    fromBase: function (baseValue, asOf, options) {
      options = options ? _.clone(options) : {};
      var that = this,
      rates = new XM.CurrencyRateCollection(),
      fetchOptions = {},
      localValue,
      rate,
      params,
      err,
      request;

      // If invalid arguments, bail
      if (!this.id || !asOf || !options.success) { return this; }

      // See if we already have the rate
      rate = _.find(_rateCache.models, function (rate) {
        var effective = rate.get("effective"),
           expires = rate.get("expires");
        // it would be nice if we could compare the rate against the rate here, but
        // given that we're in a model that only knows the currency id as its id, we
        // have to compare the CURRENCY of the rate against that.id, and then
        // perform the effective date filter as well.
        return rate.get("currency") === that.id && XT.date.inRange(asOf, effective, expires);
      });

      // If we have conversion data already, use it
      if (rate) {
        localValue = baseValue * rate.get("rate");
        options.success(localValue);

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
            baseValue: baseValue,
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
              baseValue: baseValue,
              callback: options.success
            }]
          };
          _activeRequests.push(request);

          // Define the results handler
          fetchOptions.success = function () {

            // Remove from active requests
            _activeRequests = _.filter(_activeRequests, function (request) {
              return request.currency.id !== that.id ||
                XT.date.compareDate(asOf, request.asOf) !== 0;
            });

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
              localValue = obj.baseValue / rate.get("rate");
              obj.callback(localValue);
            });
          };

          fetchOptions.error = function () {
            XT.log("Fetch rate failed in fromBase in Currency");
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
  }, {

    /**
     * Perform currency conversion and return the scalar value of the new
     * currency. Conversion is done by first converting the value to the
     * base currency, and then converting it to the target currency.
     *
     * @param {Number}  rVia      rate from value to 'via' currency
     * @param {Number}  rTarget   rate from 'via' currency to target
     * @return {Number} value of converted currency
     */
    convertVia: function (rVia, rTarget, val) {
      return (val * rVia) * rTarget;
    },
  });

  /**
    @class

    @extends XM.Document
  */
  XM.CurrencyRate = XM.Model.extend(/** @lends XM.CurrencyRate.prototype */{

    recordType: 'XM.CurrencyRate'

  }, {

    /**
     * Build a query to get the conversion rate for a currency with
     * respect to the base rate.
     */
    buildQuery: function (asof) {
      return {
        parameters: [
          {
            attribute: "effective",
            operator: "<=",
            value: asof
          },
          {
            attribute: "expires",
            operator: ">=",
            value: asof
          }/*,
          {
            attribute: "currency",
            operator: "=",
            value: currency.id
          }
          */
        ]
      };
    }

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

    model: XM.CurrencyRate,

    /**
     * Gets the rate used to convert to or from the base currency. You will
     * always multiply the returned rate with the value of your currency
     * in order to convert.
     *
     * @param {String} indicate directionality with 'to' or 'from'
     * @param {XM.Currency} the currency to convert to/from the base
     * @param {Date} the effective date
     *
     * @returns {Number} rate with respect to the base currency.
     */
    getScalarRate: function (direction, currency, asof) {
      var rate = _.find(
        this.where({ currency: currency }),
        function (_rate) {
          return moment(_rate.get('effective')).isBefore(asof) &&
            moment(_rate.get('expires')).isAfter(asof);
        });

      if (!rate || !rate.get('rate')) {
        return NaN;
      }
      if (direction === 'from base to') {
        return rate.get('rate');
      }
      if (direction === 'to base from') {
        return 1.0 / rate.get('rate');
      }
    }
  });

  _rateCache = new XM.CurrencyRateCollection();

}());
