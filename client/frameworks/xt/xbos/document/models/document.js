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

XM.Document = XM.Record.extend(
/** @scope XM.Document.prototype */ {

  className: 'XM.Document',
  
  /** 
  @type String
  */
  number: SC.Record.attr(String, { isRequired: YES }),

})
