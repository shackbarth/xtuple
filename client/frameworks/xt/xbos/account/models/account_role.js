// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Role for Accounts.

  @extends XM.Record
*/
XM.AccountRole = XM.Record.extend(
/** @scope XM.AccountRole.prototype */ {

  className: 'XM.AccountRole',

  /**
  @type String
  */
  role: SC.Record.attr(String), // Customer, Vendor, Employee etc.
  
  /**
  @type String
  */
  name: SC.Record.attr(String), // Translation string: _customer, _vendor, etc.
  
  /**
  @type String
  */
  image: SC.Record.attr(String), // Icon

});

