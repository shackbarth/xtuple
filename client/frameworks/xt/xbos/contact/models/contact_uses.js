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
XM.ContactUses = XM.Record.extend({

  className: 'XM.ContactUses',
  
  /**
  @type String
  */
  usedBy: SC.Record.attr(String),
  
  /**
  @type String
  */
  number: SC.Record.attr(String),
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  role: SC.Record.attr(String),
  
  /**
  @type String
  */
  active: SC.Record.attr(Boolean),
  
});
