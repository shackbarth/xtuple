// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_currency');

/**
  @class

  @extends XM._Currency
*/
XM.Currency = XM._Currency.extend(
  /** @scope XM.Currency.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

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
SC.ready(function() {
  XM.dataSource.ready(XM.Currency._xm_setCurrencyBase, this);
});

