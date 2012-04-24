// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_user_account');

/**
  @class

  @extends XT.Record
*/
XM.UserAccount = XT.Record.extend(XM._UserAccount,
  /** @scope XM.UserAccount.prototype */ {

  primaryKey: 'username'
  
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

