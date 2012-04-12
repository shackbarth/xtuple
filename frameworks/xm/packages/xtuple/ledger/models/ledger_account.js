// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_ledger_account');

/**
  @class

  @extends XT.Record
*/
XM.LedgerAccount = XT.Record.extend(XM._LedgerAccount,
/** @scope XM.LedgerAccount.prototype */ {

// .................................................
// CALCULATED PROPERTIES
//

number: SC.Record.attr(Number, {
  toType: function(record, key, value) {
  if(value) return value.get('length') <= 4 ? value : null;
  }
}),

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//

});

XM.LayoutIncomeStatementDetail.mixin( /** @scope XM.LayoutIncomeStatementDetail */ {

/**
  @static
  @constant
  @type String
  @default A
*/
  ASSET: 'A',

/**
  @static
  @constant
  @type String
  @default E
*/
  EXPENSE: 'E',

/**
  @static
  @constant
  @type String
  @default L
*/
  LIABILITY: 'L',

/**
  @static
  @constant
  @type String
  @default Q
*/
  EQUITY: 'Q',

/**
  @static
  @constant
  @type String
  @default R
*/
  REVENUE: 'R'

});
