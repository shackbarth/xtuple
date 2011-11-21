// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.1
*/

XM.File = XM.Document.extend(
/** @scope XM.File.prototype */ {

  className: 'XM.File',
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  data: SC.Record.attr(String),
  
})
