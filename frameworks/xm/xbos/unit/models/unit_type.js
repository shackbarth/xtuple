// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/type/models/type');

/** @class

  @extends XM.Record
  @version 0.1
*/

XM.UnitType = XM.Record.extend(
    /** @scope XM.UnitType.prototype */ {

  className: 'XM.UnitType',

  /**
  This should be the class name equivilent of the type.
  
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  This should be translatable text.
  
  @type String
  */
  description: SC.Record.attr(String),

  /**
  @type Boolean
  */
  multiple: SC.Record.attr(Boolean),

});
