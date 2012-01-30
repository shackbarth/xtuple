// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
sc_require("models/document_assignment");
/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.UrlAssignment = XM.DocumentAssignment.extend(
/** @scope XM.UrlAssignment.prototype */ {

  className: 'XM.UrlAssignment',
  
  /** 
  @type XM.Url
  */
  url: SC.Record.toOne('XM.Url', { 
    isNested: YES,
    isRequired: YES 
  })
  
});
