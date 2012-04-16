// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_cash_receipt_receivable');

/**
  @class

  @extends XT.Record
  @extends XM.SubLedgerMixin
  @extends XM.OpenReceivable
*/
XM.CashReceiptReceivable = XT.Record.extend(
  XM._CashReceiptReceivable, XM.SubLedgerMixin, XM.OpenReceivable,
  /** @scope XM.CashReceiptReceivable.prototype */ {

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

