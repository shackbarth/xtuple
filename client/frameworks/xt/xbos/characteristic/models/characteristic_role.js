// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  This class is where you can define a list of what object types may
  use characteristics.

  @extends SC.Record
  @version 0.1
*/

XM.CharacteristicRole = SC.Record.extend(
/** @scope XM.CharacteristicRole.prototype */ {

  className: 'XM.CharacteristicRole',
  
  /**
  @type XM.Type
  */
  type: SC.Record.toOne('XM.Type'),

});
