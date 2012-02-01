// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/
XM.FreightClass = XM.Record.extend(
  /** @scope XM.FreightClass.prototype */ {

  className: 'XM.FreightClass',

  createPrivilege: 'MaintainFreightClasses',
  readPrivilege:   'ViewFreightClasses',
  updatePrivilege: 'MaintainFreightClasses',
  deletePrivilege: 'MaintainFreightClasses',

  /**
  @type String
  */
  code: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

}) ;
