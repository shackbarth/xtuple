// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_currency');

/**
  @class

  @extends XM.Document
*/
XM.Currency = XM.Document.extend(XM._Currency,
  /** @scope XM.Currency.prototype */ {

  // see document mixin for object behavior(s)
  documentKey: 'name',
  
  // .................................................
  // CALCULATED PROPERTIES
  //

  abbreviation: SC.Record.attr(Boolean, {
    toType: function(record, key, value) {
      if(value && value.length > 3) return value.substr(0,3);
    }
  }),
  
  //..................................................
  // METHODS
  //

  // On instantiation, check to see if isBase should be disabled
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.checkBaseCurrency();
  },

  // Disable isBase if base currency not set
  checkBaseCurrency: function() {
    this.isBase.set('isEditable', !XM.Currency.BASE && !this.get('isBase'));
  },

  //..................................................
  // OBSERVERS
  //

  /* @private */
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments), 
        isValid, err, status = this.get('status');

    // Validate Symbol OR Abbreviation if data changed
    isValid = this.get('symbol') || this.get('abbreviation') ? true : false;
    err = XT.errors.findProperty('code', 'xt1021');
    this.updateErrors(err, !isValid);

    // Validate abbreviation - only check if changed
    if(status == SC.Record.READY_NEW || status == SC.Record.READY_DIRTY) {
      var record = this,
          abbr = record.get('abbreviation');
        
      callback = function(err, result) {
        if(!err) {
          var err = XT.errors.findProperty('code', 'xt1022'),
              id = record.get('id'),
              isConflict = result ? result !== id  : false;
            
          record.updateErrors(err, isConflict);
        }
      }
      
      XT.Record.findExisting.call(record, 'abbreviation', abbr, callback);
    }
    return errors;
  }.observes('name', 'symbol'),
  
  // On status change, check to see if isBase should be disabled
  statusDidChange: function() {
    this.checkBaseCurrency();
  }.observes('status'),

  
});

/**
  Returns a currency rate for a currency on a given date. The callback
  should accept an error code and 'XM.CurrencyRate' as expected response
  values.
  
  @param {XM.Currency} currency
  @param {SC.DateTime} effective date
  @param {Function} callback
  @returns Receiver
*/
XM.Currency.rate = function(currency, effective, callback) {
  if (!SC.kindOf(currency, XM.Currency) ||
      !SC.kindOf(effective, SC.DateTime)) return false;
  var that = this,
      store = currency.get('store'),
      qry, ary;
    
  // build the query
  qry = SC.Query.local(XM.CurrencyRate, {
    conditions: "currency = {currency} "
              + "AND effective <= {effective} "
              + "AND expires >= {effective} ",
    parameters: {
      currency: currency,
      effective: effective
    }
  });
  ary = store.find(qry);
  
  // add an observer to make the callback
  ary.addObserver('status', ary, function observer() {
    if (ary.get('status') === SC.Record.READY_CLEAN) {
      ary.removeObserver('status', ary, observer);
      if (ary.get('length')) {
        callback(null, ary.firstObject());
      } else {
        var err = XT.errors.findProperty('code', 'xt1008');
        callback(err);
      }
    }
  })
  
  return this;
}

XM.Currency.BASE = null;

/** @private */
XM.Currency._xm_setCurrencyBase = function() {
  var self = this,
      qry, ary;
    
  qry = SC.Query.local(XM.Currency, {
    conditions: "isBase"
  });
  
  ary = XT.store.find(qry);
  
  ary.addObserver('status', ary, function observer() {
    if (ary.get('status') === SC.Record.READY_CLEAN) {
      ary.removeObserver('status', ary, observer);
      XM.Currency.BASE = ary.firstObject().get('id');
    }
  })
}

// TODO: Move this to start up
XT.ready(function() {
  XT.dataSource.ready(XM.Currency._xm_setCurrencyBase, this);
});
