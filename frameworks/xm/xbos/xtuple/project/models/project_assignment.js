// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
sc_require('models/project_info');
/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.ProjectAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.ProjectAssignment.prototype */ {

  className: 'XM.ProjectAssignment',
  
  /** 
  @type XM.ProjectInfo
  */
  project: SC.Record.toOne('XM.ProjectInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
