// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('xbos/account/models/account_info');

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.AccountAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.AccountAssignment.prototype */ {

  className: 'XM.AccountAssignment',
  
  /** 
  @type XM.AccountInfo
  */
  account: SC.Record.toOne('XM.AccountInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
