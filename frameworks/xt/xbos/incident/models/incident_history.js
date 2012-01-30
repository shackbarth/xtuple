// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.IncidentHistory = XM.Record.extend(
/** @scope XM.IncidentHistory.prototype */ {

  className: 'XM.IncidentHistory',

  /**
  @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident', {
    inverse:  'history',
    isMaster: NO
  }),
  
  /**
  @type SC.DateTime
  */
  timestamp: SC.Record.attr(SC.DateTime),
  
  /**
  @type String
  */
  username: SC.Record.attr(String),
  
  /**
  @type String
  */
  description:  SC.Record.attr(String),

});
