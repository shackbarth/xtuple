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
XM.ShipVia = XM.Record.extend(
    /** @scope XM.ShipVia.prototype */ {

  className: 'XM.ShipVia',
  
  createPrivilege: 'MaintainShipVias',
  readPrivilege:   'ViewShipVias',
  updatePrivilege: 'MaintainShipVias',
  deletePrivilege: 'MaintainShipVias',

  /**
  @type String
  */
  code: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),

});
