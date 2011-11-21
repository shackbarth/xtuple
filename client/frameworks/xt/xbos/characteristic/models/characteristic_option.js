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

XM.CharacteristicOption = SC.Record.extend(
/** @scope XM.CharacteristicOption.prototype */ {

  className: 'XM.CharacteristicOption',

  /**
  @type Number
  */
  characteristic: SC.Record.attr(Number),
  
  /**
  @type String
  */
  value: SC.Record.attr(String),
  
  /**
  @type Number
  */
  order: SC.Record.attr(Number),

});
