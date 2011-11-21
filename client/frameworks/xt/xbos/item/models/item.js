// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Item.

  @extends XM.Document
*/
XM.Item = XM.Document.extend(
/** @scope XM.Item.prototype */ {

  className: 'XM.Item',
  
  createPrivilege: 'MaintainItems',
  readPrivilege:   'ViewItems',
  updatePrivilege: 'MaintainItems',
  deletePrivilege: 'MaintainItems',

  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: YES,
  }),
  
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
  type: SC.Record.attr(String),
  
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
  priceUnit: SC.Record.toOne('Xt.Unit'),
  
  /**
  @type Boolean
  */
  isConfigured: SC.Record.attr(Boolean),
  
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
  @type XM.ItemComment
  */
  comments: SC.Record.toMany('XM.ItemComment', {
    inverse: 'item',
  }),
  
  /**
  @type XM.ItemCharacteristics
  */
  characteristics: SC.Record.toMany('XM.ItemCharacteristic', {
    inverse: 'item',
  }),

  /**
  @type XM.ItemConversion
  */
  conversions: SC.Record.toMany('XM.ItemConversion', {
    inverse: 'item',
  }),
  
  /**
  @type XM.ItemAlias
  */
  aliases: SC.Record.toMany('XM.ItemAlias', {
    inverse: 'item',
  }),
  
  /**
  @type XM.ItemSubstitute
  */
  substitues: SC.Record.toMany('XM.ItemSubstitute', {
    inverse: 'rootItem',
  }),
  
  /**
  @type XM.ItemDocument
  */
  documents: SC.Record.toMany('XM.ItemDocument', {
    inverse: 'item',
  }),

});

