// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_tax_rate');

/**
  @class

  @extends XT.Record
*/
XM.TaxRate = XT.Record.extend(XM._TaxRate,
  /** @scope XM.TaxRate.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  expire: function() {
    this.set('expires', XT.DateTime.create());
  },

  //..................................................
  // OBSERVERS
  //

  /* @private */
  validate: function() {
    var errors = arguments.callee.base.apply(this, arguments),
        isErr, err;

    // validate expires date is after effective date
    var effective = this.get('effective'),
        expires = this.get('expires');

    isErr = XT.DateTime.compareDate(effective, expires) > 0;
    err = XT.errors.findProperty('code', 'xt1004');
    this.updateErrors(err, isErr);
    
    // return errors array
    return errors;
  }.observes('effective', 'expires')

});

