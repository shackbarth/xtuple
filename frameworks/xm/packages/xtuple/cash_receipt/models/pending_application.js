// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_pending_application');

/**
  @class

  @extends XM.Record
*/
XM.PendingApplication = XT.Record.extend(XM._PendingApplication,
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

XM.PendingApplication.mixin( 
  /** @scope XM.PendingApplication */ {

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

