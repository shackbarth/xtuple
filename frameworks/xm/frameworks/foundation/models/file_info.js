// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
sc_require("models/record");
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.FileInfo = XM.Record.extend(
/** @scope XM.FileInfo.prototype */ {

  className: 'XM.FileInfo',
  
  isEditable: NO,
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type String
  */
  data: SC.Record.attr(String)
  
})
