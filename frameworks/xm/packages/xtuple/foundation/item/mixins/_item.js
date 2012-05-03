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
    @type String
  */
  number: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type String
  */
  description1: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description2: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type XM.ClassCode
  */
  classCode: SC.Record.toOne('XM.ClassCode', {
    isRequired: true
  }),

  /**
    @type XM.Unit
  */
  inventoryUnit: SC.Record.toOne('XM.Unit', {
    isRequired: true
  }),

  /**
    @type Boolean
  */
  isFractional: SC.Record.attr(Boolean, {
    isRequired: true,
    defaultValue: false
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSold: SC.Record.attr(Boolean, {
    defaultValue: true
  }),

  /**
    @type XM.ProductCategory
  */
  productCategory: SC.Record.toOne('XM.ProductCategory', {
    isRequired: true,
    defaultValue: -1
  }),

  /**
    @type Number
  */
  listPrice: SC.Record.attr(Number, {
    isRequired: true
  }),

  /**
    @type XM.Unit
  */
  priceUnit: SC.Record.toOne('XM.Unit', {
    isRequired: true
  }),

  /**
    @type String
  */
  extendedDescription: SC.Record.attr(String),

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
    @type XM.ContactAccount
  */
  accounts: SC.Record.toMany('XM.ContactAccount', {
    isNested: true,
    inverse: 'source'
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

};
