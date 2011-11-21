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

XM.Url = XM.Record.extend(
/** @scope XM.Url.prototype */ {

  className: 'XM.Url',
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  url: SC.Record.attr(String),

})
