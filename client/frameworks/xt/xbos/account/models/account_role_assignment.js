// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Role Assignment for Accounts.

  @extends XM.Record
*/
XM.AccountRoleAssignment = XM.Record.extend(
/** @scope XM.AccountRoleAssignment.prototype */ {

  className: 'XM.AccountRoleAssignment',

  /**
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account', {
    inverse: 'roles',
  }),
  
    /**
  @type XM.AccountRole
  */
  accountRole: SC.Record.toOne('XM.AccountRole'),

});

