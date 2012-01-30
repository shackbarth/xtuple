// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.CharacteristicAssignment
*/
XM.IncidentCharacteristic = XM.CharacteristicAssignment.extend(
/** @scope XM.IncidentCharacteristic.prototype */ {

  className: 'XM.IncidentCharacteristic',

  /**
  @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
}) ;
