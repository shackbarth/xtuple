// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('xbos/incident/models/incident_info');

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.IncidentAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.IncidentAssignment.prototype */ {

  className: 'XM.IncidentAssignment',
  
  /** 
  @type XM.IncidentInfo
  */
  incident: SC.Record.toOne('XM.IncidentInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
