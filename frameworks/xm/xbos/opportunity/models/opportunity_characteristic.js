// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/characteristic/models/characteristic_assignment');

/** @class

  (Document your Model here)

  @extends XM.CharacteristicAssignment
*/
XM.OpportunityCharacteristic = XM.CharacteristicAssignment.extend(
/** @scope XM.OpportunityCharacteristic.prototype */ {

  className: 'XM.OpportunityCharacteristic',

  /**
  @type XM.Opportunity
  */
  opportunity: SC.Record.toOne('XM.Opportunity', {
    inverse:  'characteristics',
    isMaster: NO,
  }),
  
}) ;
