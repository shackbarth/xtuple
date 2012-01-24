// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
*/
XM.ProjectDocument = XM.DocumentAssignment.extend(
/** @scope XM.ProjectDocument.prototype */ {

  className: 'XM.ProjectDocument',

  /**
  @type XM.Project
  */
  opportunity: SC.Record.toOne('XM.Project', {
    inverse:  'documents',
    isMaster: NO
  })
  
}) ;
