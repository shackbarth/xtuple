// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/
XM.Unit = XM.Record.extend(
    /** @scope XM.Unit.prototype */ {

  className: 'XM.Unit',

  createPrivilege: 'MaintainUOMs',
  readPrivilege:   'ViewUOMs',
  updatePrivilege: 'MaintainUOMs',
  deletePrivilege: 'MaintainUOMs',
   
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isItemWeight: SC.Record.attr(Boolean),
  
  /**
  @type XM.UnitConversion
  */
  conversions: SC.Record.toOne("XM.UnitConversion", {
    isMaster: YES,
  }),

});
