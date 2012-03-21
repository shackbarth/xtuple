// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/currency/mixins/_currency');

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
        // used for proper object reference during callback function below
        record = this,
        status = record.get('status'),
        abbr = record.get('abbreviation'),
        isValid, err;

    // Validate Symbol OR Abbreviation
    isValid = this.get('symbol') || this.get('abbreviation') ? true : false;
    err = XM.errors.findProperty('code', 'xt1021');
    this.updateErrors(err, !isValid);

    // Validate Unique Name
    if(status & SC.Record.READY) {
      callback = function(err, result) {
        if(!err) {
          var err = XM.errors.findProperty('code', 'xt1022'),
              id = record.get('id'),
              isConflict = result ? result !== id  : false;
            
          record.updateErrors(err, isConflict);
        }
      }
    }
    XM.Record.findExisting.call(record, 'abbreviation', abbr, callback);
  
    return errors;
  }.observes('name', 'symbol', 'abbreviation'),
  
  // On status change, check to see if isBase should be disabled
  statusDidChange: function() {
    this.checkBaseCurrency();
  }.observes('status')

});

XM.Currency.BASE = null;

/** @private */
XM.Currency._xm_setCurrencyBase = function() {
  var self = this,
      qry, ary;
    
  qry = SC.Query.local(XM.Currency, {
    conditions: "isBase"
  });
  
  ary = XM.store.find(qry);
  
  ary.addObserver('status', ary, function observer() {
    if (ary.get('status') === SC.Record.READY_CLEAN) {
      ary.removeObserver('status', ary, observer);
      XM.Currency.BASE = ary.firstObject().get('id');
    }
  })
}

// TODO: Move this to start up
XM.ready(function() {
  XM.dataSource.ready(XM.Currency._xm_setCurrencyBase, this);
});
