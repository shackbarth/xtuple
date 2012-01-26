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

XM.FileAssignment = XM.Record.extend( XT.DocumentAssignment,
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
