// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
sc_require("models/record");
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.ContactInfo = XM.Record.extend(
/** @scope XM.ContactInfo.prototype */ {

  className: 'XM.ContactInfo',
  
  isEditable: NO,
  
  nestedRecordNamespace: XM,
  
  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  jobTitle: SC.Record.attr(String),
  
  /**
  @type String
  */
  isActive: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  phone: SC.Record.attr(String),
  
  /**
  @type String
  */
  alternate:SC.Record.attr(String),
  
  /**
  @type String
  */
  fax: SC.Record.attr(String),
  
  /**
  @type String
  */
  primaryEmail: SC.Record.attr(String),
  
  /**
  @type String
  */
  webAddress: SC.Record.attr(String),
  
  /**
  @type XM.AddressInfo
  */
  address: SC.Record.toOne('XM.AddressInfo', { 
    isNested: YES 
  })
  
});
