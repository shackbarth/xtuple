// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.ClassCode = XM.Record.extend(
    /** @scope XM.ClassCode.prototype */ {

  className: 'XM.ClassCode',

  createPrivilege: 'MaintainClassCodes',
  readPrivilege:   'ViewClassCodes',
  updatePrivilege: 'MaintainClassCodes',
  deletePrivilege: 'MaintainClassCodes',

  /**
  @type String
  */
  code: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

}) ;
