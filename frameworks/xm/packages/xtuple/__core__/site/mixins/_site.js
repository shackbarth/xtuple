// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Site
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Site = {
  /** @scope XM.Site.prototype */
  
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
  code: SC.Record.attr(String, {
    label: '_code'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type XM.Address
  */
  address: SC.Record.toOne('XM.Address', {
    label: '_address'.loc()
  }),

  /**
    @type XM.TaxZone
  */
  zones: SC.Record.toOne('XM.TaxZone', {
    label: '_zones'.loc()
  }),

  /**
    @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact', {
    label: '_contact'.loc()
  }),

  /**
    @type String
  */
  shippingNotes: SC.Record.attr(String, {
    label: '_shippingNotes'.loc()
  }),

  /**
    @type Number
  */
  aisleSize: SC.Record.attr(Number, {
    label: '_aisleSize'.loc()
  }),

  /**
    @type Number
  */
  binSize: SC.Record.attr(Number, {
    label: '_binSize'.loc()
  }),

  /**
    @type Number
  */
  countTagNumber: SC.Record.attr(Number, {
    label: '_countTagNumber'.loc()
  }),

  /**
    @type String
  */
  countTagPrefix: SC.Record.attr(String, {
    label: '_countTagPrefix'.loc()
  }),

  /**
    @type String
  */
  defaultFob: SC.Record.attr(String, {
    label: '_defaultFob'.loc()
  }),

  /**
    @type Boolean
  */
  isAisleAlpha: SC.Record.attr(Boolean, {
    label: '_isAisleAlpha'.loc()
  }),

  /**
    @type Boolean
  */
  isBinAlpha: SC.Record.attr(Boolean, {
    label: '_isBinAlpha'.loc()
  }),

  /**
    @type Boolean
  */
  isEnforceCountSlips: SC.Record.attr(Boolean, {
    label: '_isEnforceCountSlips'.loc()
  }),

  /**
    @type Boolean
  */
  isEnforceNaming: SC.Record.attr(Boolean, {
    label: '_isEnforceNaming'.loc()
  }),

  /**
    @type Boolean
  */
  isEnforceZones: SC.Record.attr(Boolean, {
    label: '_isEnforceZones'.loc()
  }),

  /**
    @type Boolean
  */
  isLocationAlpha: SC.Record.attr(Boolean, {
    label: '_isLocationAlpha'.loc()
  }),

  /**
    @type Boolean
  */
  isRackAlpha: SC.Record.attr(Boolean, {
    label: '_isRackAlpha'.loc()
  }),

  /**
    @type Boolean
  */
  isShipping: SC.Record.attr(Boolean, {
    label: '_isShipping'.loc()
  }),

  /**
    @type Number
  */
  locationSize: SC.Record.attr(Number, {
    label: '_locationSize'.loc()
  }),

  /**
    @type Number
  */
  rackSize: SC.Record.attr(Number, {
    label: '_rackSize'.loc()
  }),

  /**
    @type XM.SiteType
  */
  siteType: SC.Record.toOne('XM.SiteType', {
    label: '_siteType'.loc()
  }),

  /**
    @type XM.SiteComment
  */
  comments: SC.Record.toMany('XM.SiteComment', {
    isNested: true,
    inverse: 'site',
    label: '_comments'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    label: '_isActive'.loc()
  })

};
