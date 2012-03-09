// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Site
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Site = XM.Record.extend(
  /** @scope XM.Site.prototype */ {
  
  className: 'XM.Site',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainAllItemSites",
      "read": "ViewAllItemSites",
      "update": "MaintainAllItemSites",
      "delete": "MaintainAllItemSites"
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  code: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type XM.Address
  */
  address: SC.Record.toOne('XM.Address'),

  /**
    @type XM.TaxZone
  */
  zones: SC.Record.toOne('XM.TaxZone'),

  /**
    @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact'),

  /**
    @type String
  */
  shippingNotes: SC.Record.attr(String),

  /**
    @type Number
  */
  aisleSize: SC.Record.attr(Number),

  /**
    @type Number
  */
  binSize: SC.Record.attr(Number),

  /**
    @type Number
  */
  countTagNumber: SC.Record.attr(Number),

  /**
    @type String
  */
  countTagPrefix: SC.Record.attr(String),

  /**
    @type String
  */
  defaultFob: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isAisleAlpha: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isBinAlpha: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isEnforceCountSlips: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isEnforceNaming: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isEnforceZones: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isLocationAlpha: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isRackAlpha: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isShipping: SC.Record.attr(Boolean),

  /**
    @type Number
  */
  locationSize: SC.Record.attr(Number),

  /**
    @type Number
  */
  rackSize: SC.Record.attr(Number),

  /**
    @type XM.SiteType
  */
  siteType: SC.Record.toOne('XM.SiteType'),

  /**
    @type XM.SiteComment
  */
  comments: SC.Record.toMany('XM.SiteComment', {
    isNested: true,
    inverse: 'site'
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean)

});
