// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  An internally maintained list of privileges.

  @extends XM.Record
  @version 0.1
*/

XM.Privilege = XM.Record.extend(
/** @scope XM.Privilege.prototype */ {

  className: 'XM.Privilege',
  
  isEditable: NO,

  /**
  @type String
  */
  module: SC.Record.attr(String, { 
    isRequired: YES ,
  }),
  
  /**
  @type String
  */
  name: SC.Record.attr(String, { 
    isRequired: YES ,
  }),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
});


