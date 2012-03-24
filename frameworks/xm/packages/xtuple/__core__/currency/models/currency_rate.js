// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/currency/mixins/_currency_rate');

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
      var _xm_effective = this.get('effective').toFormattedString('%Y-%m-%dT%H:%M:%S%Z'),
          _xm_expires = this.get('expires').toFormattedString('%Y-%m-%dT%H:%M:%S%Z'),
          _xm_currency = this.getPath('currency.guid'),
          _xm_guid = this.get('id'),
          qry;

      qry = SC.Query.local(XM.CurrencyRate, {
        conditions: "((currency = {currency}) AND (guid != {guid})) "
                    + "AND ( "
                    + "     (((effective >= {effective}) AND (effective <= {expires})) OR"
                    + "      ((expires >= {effective}) AND (expires <= {expires}))) "
                    + "    OR "
                    + "     ((effective <= {effective}) AND "
                    + "      (expires >= {expires})) "
                    + "    )",
        parameters: {  currency: _xm_currency,
                           guid: _xm_guid,
                      effective: _xm_effective,
                        expires: _xm_expires}
      });
      this._xm_dateOverlaps = XM.store.find(qry);
    }
    
    return this._xm_dateOverlaps;
  }.property().cacheable()
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

