// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Item
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._Item = XM.Record.extend(
  /** @scope XM.Item.prototype */ {
  
  className: 'XM.Item',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "ViewItemMasters",
      "read": "ViewItemMasters",
      "update": "ViewItemMasters",
      "delete": "ViewItemMasters"
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
    @type Number
  */
  number: SC.Record.attr(Number),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean),

  /**
    @type String
  */
  description1: SC.Record.attr(String),

  /**
    @type String
  */
  description2: SC.Record.attr(String),

  /**
    @type XM.ClassCode
  */
  classCode: SC.Record.toOne('XM.ClassCode'),

  /**
    @type XM.Unit
  */
  inventoryUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type Boolean
  */
  isPicklist: SC.Record.attr(Boolean),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSold: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  isFractional: SC.Record.attr(Boolean),

  /**
    @type String
  */
  itemType: SC.Record.attr(String),

  /**
    @type Number
  */
  productWeight: SC.Record.attr(Number),

  /**
    @type Number
  */
  packageWeight: SC.Record.attr(Number),

  /**
    @type XM.ProductCategory
  */
  productCategory: SC.Record.toOne('XM.ProductCategory'),

  /**
    @type Boolean
  */
  isExclusive: SC.Record.attr(Boolean),

  /**
    @type Number
  */
  listPrice: SC.Record.attr(Number),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit'),

  /**
    @type String
  */
  extendedDescription: SC.Record.attr(String),

  /**
    @type String
  */
  barcode: SC.Record.attr(String),

  /**
    @type Number
  */
  warrantyDays: SC.Record.attr(Number),

  /**
    @type XM.FreightClass
  */
  freightClass: SC.Record.toOne('XM.FreightClass'),

  /**
    @type Number
  */
  maxCost: SC.Record.attr(Number),

  /**
    @type XM.ItemComment
  */
  comments: SC.Record.toMany('XM.ItemComment', {
    isNested: true,
    inverse: 'item'
  }),

  /**
    @type XM.ItemCharacteristic
  */
  characteristics: SC.Record.toMany('XM.ItemCharacteristic', {
    isNested: true,
    inverse: 'item'
  }),

  /**
    @type XM.ItemConversion
  */
  conversions: SC.Record.toMany('XM.ItemConversion', {
    isNested: true,
    inverse: 'item'
  }),

  /**
    @type XM.ItemAlias
  */
  aliases: SC.Record.toMany('XM.ItemAlias', {
    isNested: true,
    inverse: 'item'
  }),

  /**
    @type XM.ItemSubstitute
  */
  substitutes: SC.Record.toMany('XM.ItemSubstitute', {
    isNested: true,
    inverse: 'item'
  }),

  /**
    @type XM.ItemContact
  */
  contacts: SC.Record.toMany('XM.ItemContact', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ItemItem
  */
  items: SC.Record.toMany('XM.ItemItem', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ItemFile
  */
  files: SC.Record.toMany('XM.ItemFile', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ItemImage
  */
  images: SC.Record.toMany('XM.ItemImage', {
    isNested: true,
    inverse: 'source'
  }),

  /**
    @type XM.ItemUrl
  */
  urls: SC.Record.toMany('XM.ItemUrl', {
    isNested: true,
    inverse: 'source'
  })

});
