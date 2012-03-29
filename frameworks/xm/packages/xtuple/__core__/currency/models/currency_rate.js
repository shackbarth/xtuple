// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_currency_rate');

/**
  @class

  @extends XT.Record
*/
XM.CurrencyRate = XT.Record.extend(XM._CurrencyRate,
  /** @scope XM.CurrencyRate.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /** @private
 
    Array of XM.CurrencyRate records that have effective - expires
    date(s) conflicts...
  */
  dateOverlaps: function() {
    var status = this.get('status');
    if(status == SC.Record.READY_NEW || status == SC.Record.READY_DIRTY) {
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
        parameters: {  
          currency: currencyRec,
          id: currencyRateId,
          effective: effectiveDate,
          expires: expiresDate 
        }
      });
      this._xm_dateOverlaps = XT.store.find(qry);
    }    
    return this._xm_dateOverlaps || [];
  }.property('effective', 'expires').cacheable(),
  
  /** @private */
  dateOverlapsLength: 0,
  
  /** @private */
  dateOverlapsLengthBinding: SC.Binding.from('*dateOverlaps.length').noDelay(),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /* @private */
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments),
        isErr, err;

    // validate effective and expires date range
    isErr = this.get('dateOverlapsLength') > 0 ? true : false;
    err = XT.errors.findProperty('code', 'xt1003');
    this.updateErrors(err, isErr);

    // validate expires date is after effective date
    var effective = this.get('effective'),
        expires = this.get('expires');
    isErr = SC.DateTime.compareDate(effective, expires) > 0;
    err = XT.errors.findProperty('code', 'xt1004');
    this.updateErrors(err, isErr);
    
    // return errors array
    return errors;
  }.observes('effective', 'expires','dataOverlapsLength')
  
});

