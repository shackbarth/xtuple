// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record

*/

XM.AddressInfo = XM.Record.extend(
/** @scope XM.AddressInfo.prototype */ {

  className:   'XM.AddressInfo',
  
  isEditable: NO,

  /*
  @type String
  */
  number:     SC.Record.attr(String)
  }),
  
  /**
  @type String
  */
  line1:      SC.Record.attr(String),
  
  /**
  @type String
  */
  line2:      SC.Record.attr(String),
  
  /**
  @type String
  */
  line3:      SC.Record.attr(String),
  
  /**
  @type String
  */
  city:	      SC.Record.attr(String),
  
  /**
  @type String
  */
  state:      SC.Record.attr(String),
  
  /**
  @type String
  */
  postalcode: SC.Record.attr(String),
  
  /**
  @type String
  */
  country:    SC.Record.attr(String)
  
});

