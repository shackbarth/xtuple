// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.Item
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._Item = {
  /** @scope XM.Item.prototype */
  
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
  number: SC.Record.attr(Number, {
    isRequired: true,
    label: '_number'.loc()
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isActive'.loc()
  }),

  /**
    @type String
  */
  description1: SC.Record.attr(String, {
    label: '_description1'.loc()
  }),

  /**
    @type String
  */
  description2: SC.Record.attr(String, {
    label: '_description2'.loc()
  }),

  /**
    @type XM.ClassCode
  */
  classCode: SC.Record.toOne('XM.ClassCode', {
    isRequired: true,
    label: '_classCode'.loc()
  }),

  /**
    @type XM.Unit
  */
  inventoryUnit: SC.Record.toOne('XM.Unit', {
    isRequired: true,
    label: '_inventoryUnit'.loc()
  }),

  /**
    @type Boolean
  */
  isPicklist: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isPicklist'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  }),

  /**
    @type Boolean
  */
  isSold: SC.Record.attr(Boolean, {
    defaultValue: true,
    label: '_isSold'.loc()
  }),

  /**
    @type Boolean
  */
  isFractional: SC.Record.attr(Boolean, {
    label: '_isFractional'.loc()
  }),

  /**
    @type String
  */
  itemType: SC.Record.attr(String, {
    label: '_itemType'.loc()
  }),

  /**
    @type Number
  */
  productWeight: SC.Record.attr(Number, {
    label: '_productWeight'.loc()
  }),

  /**
    @type Number
  */
  packageWeight: SC.Record.attr(Number, {
    label: '_packageWeight'.loc()
  }),

  /**
    @type XM.ProductCategory
  */
  productCategory: SC.Record.toOne('XM.ProductCategory', {
    isRequired: true,
    label: '_productCategory'.loc()
  }),

  /**
    @type Boolean
  */
  isExclusive: SC.Record.attr(Boolean, {
    label: '_isExclusive'.loc()
  }),

  /**
    @type Number
  */
  listPrice: SC.Record.attr(Number, {
    label: '_listPrice'.loc()
  }),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit', {
    isRequired: true,
    label: '_priceUnit'.loc()
  }),

  /**
    @type String
  */
  extendedDescription: SC.Record.attr(String, {
    label: '_extendedDescription'.loc()
  }),

  /**
    @type String
  */
  barcode: SC.Record.attr(String, {
    label: '_barcode'.loc()
  }),

  /**
    @type Number
  */
  warrantyDays: SC.Record.attr(Number, {
    label: '_warrantyDays'.loc()
  }),

  /**
    @type XM.FreightClass
  */
  freightClass: SC.Record.toOne('XM.FreightClass', {
    label: '_freightClass'.loc()
  }),

  /**
    @type Number
  */
  maxCost: SC.Record.attr(Number, {
    label: '_maxCost'.loc()
  }),

  /**
    @type XM.ItemComment
  */
  comments: SC.Record.toMany('XM.ItemComment', {
    isNested: true,
    inverse: 'item',
    label: '_comments'.loc()
  }),

  /**
    @type XM.ItemCharacteristic
  */
  characteristics: SC.Record.toMany('XM.ItemCharacteristic', {
    isNested: true,
    inverse: 'item',
    label: '_characteristics'.loc()
  }),

  /**
    @type XM.ItemConversion
  */
  conversions: SC.Record.toMany('XM.ItemConversion', {
    isNested: true,
    inverse: 'item',
    label: '_conversions'.loc()
  }),

  /**
    @type XM.ItemAlias
  */
  aliases: SC.Record.toMany('XM.ItemAlias', {
    isNested: true,
    inverse: 'item',
    label: '_aliases'.loc()
  }),

  /**
    @type XM.ItemSubstitute
  */
  substitutes: SC.Record.toMany('XM.ItemSubstitute', {
    isNested: true,
    inverse: 'item',
    label: '_substitutes'.loc()
  }),

  /**
    @type XM.ItemContact
  */
  contacts: SC.Record.toMany('XM.ItemContact', {
    isNested: true,
    inverse: 'source',
    label: '_contacts'.loc()
  }),

  /**
    @type XM.ItemItem
  */
  items: SC.Record.toMany('XM.ItemItem', {
    isNested: true,
    inverse: 'source',
    label: '_items'.loc()
  }),

  /**
    @type XM.ItemFile
  */
  files: SC.Record.toMany('XM.ItemFile', {
    isNested: true,
    inverse: 'source',
    label: '_files'.loc()
  }),

  /**
    @type XM.ItemImage
  */
  images: SC.Record.toMany('XM.ItemImage', {
    isNested: true,
    inverse: 'source',
    label: '_images'.loc()
  }),

  /**
    @type XM.ItemUrl
  */
  urls: SC.Record.toMany('XM.ItemUrl', {
    isNested: true,
    inverse: 'source',
    label: '_urls'.loc()
  })

};
