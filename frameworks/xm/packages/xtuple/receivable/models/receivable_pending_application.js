// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

// PLACE ME IN ../client/frameworks/xm/packages/xtuple/receivable/models

sc_require('mixins/_receivable_pending_application');

/**
  @class

  @extends XM.Record
*/
XM.ReceivablePendingApplication = XT.Record.extend(XM._ReceivablePendingApplication,
  /** @scope XM.ReceivablePendingApplication.prototype */ {

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

XM.ReceivablePendingApplication.mixin( 
  /** @scope XM.ReceivablePendingApplication */ {

/**
  Cash Receipt application type.
  
  @static
  @constant
  @type String
  @default R
*/
  CASH_RECEIPT: 'R',

/**
  Credit Memo application type.
  
  @static
  @constant
  @type String
  @default C
*/
  CREDIT: 'C'

});

