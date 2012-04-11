// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_sub_account');

/**
  @class

  @extends XT.Record
*/
XM.SubAccount = XT.Record.extend(XM._SubAccount,
/** @scope XM.SubAccount.prototype */ {

// .................................................
// CALCULATED PROPERTIES
//

number: SC.Record.attr(Number, {
  toType: function(record, key, value) {
  if(value) return value.get('length') <= 2 ? value : null;
  }
}),

//..................................................
// METHODS
//

//..................................................
// OBSERVERS
//

});

