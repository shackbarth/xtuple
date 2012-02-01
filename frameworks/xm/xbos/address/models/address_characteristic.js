// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XM.CharacteristicAssignment
*/
XM.AddressCharacteristic = XM.CharacteristicAssignment.extend(
/** @scope XM.AddressCharacteristic.prototype */ {

  className: 'XM.AddressCharacteristic',

  /**
  @type XM.Address
  */
  address: SC.Record.toOne('XM.Address', {
    inverse:  'characteristics',
    isMaster: NO,
  }),
  
}) ;
