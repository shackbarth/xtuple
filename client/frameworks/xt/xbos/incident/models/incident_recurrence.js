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

XM.IncidentRecurrence = XM.Record.extend( XM.Recurrence,
/** @scope XM.IncidentRecurrence.prototype */ {

  className: 'XM.IncidentRecurrence',
  
  /** 
  @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident')

});
