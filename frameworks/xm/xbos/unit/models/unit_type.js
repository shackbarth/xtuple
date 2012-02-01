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

XM.UnitType = XM.Type.extend(
    /** @scope XM.UnitType.prototype */ {

  className: 'XM.UnitType',

  /**
  @type Boolean
  */
  multiple: SC.Record.attr(Boolean),

});
