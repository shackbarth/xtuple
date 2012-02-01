// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('xbos/characteristic/models/characteristic_assignment');

/** @class

  (Document your Model here)

  @extends XM.CharacteristicAssignment
*/

XM.ItemCharacteristic = XM.CharacteristicAssignment.extend(
/** @scope XM.ItemCharacteristic.prototype */ {

  className: 'XM.ItemCharacteristic',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse:  'characteristics',
    isMaster: NO,
  }),
  
});
