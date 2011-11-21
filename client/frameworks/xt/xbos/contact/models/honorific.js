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

XM.Honorific = XM.Record.extend(
/** @scope XM.Honorific.prototype */ {

  className: 'XM.Honorific',

  createPrivilege: 'MaintainTitles',
  readPrivilege:   'ViewTitles',
  updatePrivilege: 'MaintainTitles',
  deletePrivilege: 'MaintainTitles',

  /**
  @type String
  */
  code: SC.Record.attr(String, { 
    isRequired: YES 
  }),

}) ;

