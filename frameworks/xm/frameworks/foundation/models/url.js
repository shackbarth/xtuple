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
  path: SC.Record.attr(String),

})
