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
    date(s) conflicts...
  */
  dateOverlaps: function() {
    if(!this._xm_dateOverlaps) {
      var effectiveDate = this.get('effective'),
          expiresDate = this.get('expires'),
          currencyRec = this.get('currency'),
          currencyRateId = this.get('id'),
          qry;

      qry = SC.Query.local(XM.CurrencyRate, {
        conditions: "((currency = {currency}) AND (id != {id})) "
                    + "AND ( "
                    + "     (((effective >= {effective}) AND (effective <= {expires})) OR"
                    + "      ((expires >= {effective}) AND (expires <= {expires}))) "
                    + "    OR "
                    + "     ((effective <= {effective}) AND "
                    + "      (expires >= {expires})) "
                    + "    )",
        parameters: {  currency: currencyRec,
                             id: currencyRateId,
                      effective: effectiveDate,
                        expires: expiresDate }
      });
      this._xm_dateOverlaps = XM.store.find(qry);
    }
    
    return this._xm_dateOverlaps;
  }.property('effective', 'expires').cacheable(),

  /** @private */
  dateOverlapsLengthBinding: '*dateOverlaps.length',
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /* @private */
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments),
        isValid, err;

    // Validate effective and expires date range
    isValid = this.get('dateOverlapsLength') <= 0 ? true : false;
    err = XM.errors.findProperty('code', 'xt1003');
    this.updateErrors(err, !isValid);

    // Validate expires date is NOT before effective date
    isValid = this.get('effective') <= this.get('expires') ? true : false;
    err = XM.errors.findProperty('code', 'xt1004');
    this.updateErrors(err, !isValid);

    return errors;
  }.observes('dateOverlapsLength', 'effective', 'expires')
  
});

