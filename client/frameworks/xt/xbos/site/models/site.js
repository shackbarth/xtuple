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
XM.Site = XM.Record.extend(
    /** @scope XM.Site.prototype */ {

  className: 'XM.Site',

  createPrivilege: 'MaintainWarehouses',
  readPrivilege:   'ViewWarehouses',
  updatePrivilege: 'MaintainWarehouses',
  deletePrivilege: 'MaintainWarehouses',

  /**
  @type String
  */
  code: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type XM.SiteType
  */
  siteType: SC.Record.toOne('XM.SiteType'),
  
  /**
  @type String
  */
  defaultFob: SC.Record.attr(String),
  
  // shippingCommission: SC.Record.attr(Number), Not implemented
  
  /**
  @type String
  */
  countTagPrefix: SC.Record.attr(String),
  
  /**
  @type Number
  */
  countTagNumber: SC.Record.attr(Number),
  
  // billOfLadingPrefix: SC.Record.attr(String), Not implemented
  // billOfLadingNumber: SC.Record.attr(Number), Not implemented
  
  /**
  @type Boolean
  */
  isShipping: SC.Record.attr(Boolean),
  
  /**
  @type Boolean
  */
  isEnforceCountSlips: SC.Record.attr(Boolean),
  
  /**
  @type Boolean
  */
  isEnforceZones: SC.Record.attr(Boolean),
  
  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact'),
  
  /**
  @type XM.Address
  */
  address: SC.Record.toOne('XM.Address'),
  
  /**
  @type Number
  */
  aisleSize: SC.Record.attr(Number),
  
  /**
  @type Boolean
  */
  isAisleAlpha: SC.Record.attr(Boolean),
  
  /**
  @type Number
  */
  rackSize: SC.Record.attr(Number),
  
  /**
  @type Boolean
  */
  isRackAlpha: SC.Record.attr(Boolean),
  
  /**
  @type Number
  */
  binSize: SC.Record.attr(Number),
  
  /**
  @type Boolean
  */
  isBinAlpha: SC.Record.attr(Boolean),
  
  /**
  @type Number
  */
  locationSize: SC.Record.attr(Number),
  
  /**
  @type Boolean
  */
  isLocationAlpha: SC.Record.attr(Boolean),
  
  /**
  @type Boolean
  */
  isEnforceNaming: SC.Record.attr(Boolean),
  
  /**
  @type Boolean
  */
  shippingNotes: SC.Record.attr(String),
  
  /**
  @type XM.SiteZone
  */
  zones: SC.Record.toMany('XM.SiteZone'),
  
  /**
  @type XM.SiteComment
  */
  comments: SC.Record.toMany('XM.SiteComment', {
    inverse: 'site',
  }),

});
