// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_currency_rate');

/**
  @class

  @extends XM.Record
*/
XM.CurrencyRate = XM.Record.extend(XM._CurrencyRate,
  /** @scope XM.CurrencyRate.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /** @private
 
    Array of XM.CurrencyRate records that have effective - expires
    date conflicts...
  */
  dateOverlaps: function() {
    if(!this._xm_dateOverlaps) {
      var _xm_effective = this.get('effective'),
          qry = this._xm_qry;

      if(!qry) {
        qry = this._xm_qry = SC.Query.local(XM.CurrencyRate, {
          conditions: "effective = {effective}",
          parameters: {effective: _xm_effective}
        });
      }
      this._xm_dateOverlaps = XM.store.find(qry);
    }
    
    return this._xm_dateOverlaps;
  }.property('effective').cacheable(),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

