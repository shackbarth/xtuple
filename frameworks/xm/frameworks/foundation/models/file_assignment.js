// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require("models/document_assignment");

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.FileAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.FileAssignment.prototype */ {

  className: 'XM.FileAssignment',
  
  /** 
  @type XM.FileInfo
  */
  file: SC.Record.toOne('XM.FileInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
