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
XM.SiteZone = XM.Record.extend(
    /** @scope XM.SiteZone.prototype */ {

  className: 'XM.SiteZone',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

});
