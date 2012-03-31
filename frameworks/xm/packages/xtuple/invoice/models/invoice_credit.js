// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_invoice_credit');

/**
  @class

  @extends XT.Record
*/
XM.InvoiceCredit = XT.Record.extend(XM._InvoiceCredit,
  /** @scope XM.InvoiceCredit.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  /**
    Tell the parent to recalculate.
  */
  destroy: function() {
    arguments.callee.base.apply(this, arguments);
    var parentRecord = this.get('parentRecord');
    if (parentRecord) parentRecord.updateAllocatedCredit();
  }

  //..................................................
  // OBSERVERS
  //

});

