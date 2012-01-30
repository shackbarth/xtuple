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
XM.ProductCategory = XM.Record.extend(
/** @scope XM.ProductCategory.prototype */ {

  className: 'XM.ProductCategory',

  createPrivilege: 'MaintainProductCategories',
  readPrivilege:   'ViewProductCategories',
  updatePrivilege: 'MaintainProductCategories',
  deletePrivilege: 'MaintainProductCategories',

  /** @property */
  code: SC.Record.attr(String),
  
  /** @property */
  description: SC.Record.attr(String)

}) ;
