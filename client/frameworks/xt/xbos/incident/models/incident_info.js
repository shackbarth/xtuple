// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.IncidentInfo = XM.Record.extend({
   /** @scope XM.IncidentInfo.prototype */ 

  className: 'XM.IncidentInfo',

  isEditable: NO,

  /**
  @type String
  */
  number: SC.Record.attr(String),

  /**
  @type String
  */
  description: SC.Record.attr(String)

});
