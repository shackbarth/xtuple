// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_apply_credit_receivable');
sc_require('mixins/open_receivable');

/**
  @class

  @extends XT.Record
*/
XM.ApplyCreditReceivable = XT.Record.extend(
  XM._ApplyCreditReceivable, XM.SubLedgerMixin, XM.OpenReceivable,
  /** @scope XM.ApplyCreditReceivable.prototype */ {

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

