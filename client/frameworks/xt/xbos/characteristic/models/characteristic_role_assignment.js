// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/

XM.CharacteristicRoleAssignment = XM.Record.extend(
/** @scope XM.CharacteristicRoleAssignment.prototype */ {

  className: 'XM.CharacteristicRoleAssignment',
  
  /**
  @type XM.Characteristic
  */
  characteristic: XM.Record.toOne('XM.Characteristic', {
    inverse: 'roles',
  }),
  
  /**
  @type XM.CharacteristicRole
  */
  characteristicRole: XM.Record.toOne('XM.CharacteristicRole'),

});
