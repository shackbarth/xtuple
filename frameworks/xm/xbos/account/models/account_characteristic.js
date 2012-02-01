// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.CharacteristicAssignment
*/
XM.AccountCharacteristic = XM.CharacteristicAssignment.extend(
/** @scope XM.AccountCharacteristic.prototype */ {

  className: 'XM.AccountCharacteristic',

  /**
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
}) ;
