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
XM.SiteType = XM.Record.extend(
    /** @scope XM.SiteType.prototype */ {

  className: 'XM.SiteType',

  createPrivilege: 'MaintainSiteTypes',
  readPrivilege:   'ViewSiteTypes',
  updatePrivilege: 'MaintainSiteTypes',
  deletePrivilege: 'MaintainSiteTypes',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

});
