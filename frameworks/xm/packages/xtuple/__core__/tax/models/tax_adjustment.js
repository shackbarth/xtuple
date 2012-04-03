// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class
  
  Supports TaxableDocument

  @seealso XM.TaxableDocument
  @extends XT.Record
*/
XM.TaxAdjustment = XT.Record.extend(
  /** @scope XM.TaxAdjustment.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  /**
    Tell the parent taxable document to recalculate total.
  */
  destroy: function() {
    arguments.callee.base.apply(this, arguments);
    var parentRecord = this.get('parentRecord');
    if (parentRecord) parentRecord.updateMiscTax();
  }

  //..................................................
  // OBSERVERS
  //

});

