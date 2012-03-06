// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @class

  This code is automatically generated and will be over-written. Do not edit directly.

  @extends XM.Record
*/
XM._CreditMemoLine = XM.Record.extend(
  /** @scope XM._CreditMemoLine.prototype */ {
  
  className: 'XM.CreditMemoLine',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
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
    @type XM.CreditMemo
  */
  creditMemo: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type Number
  */
  lineNumber: SC.Record.attr(Number),

  /**
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toOne('XM.ReasonCode'),

  /**
    @type XM.ItemSiteInfo
  */
  itemSite: SC.Record.toMany('XM.ItemSiteInfo', {
    isNested: true,
    inverse: 'guid'
  }),

  /**
    @type Number
  */
  quantityReturned: SC.Record.attr(Number),

  /**
    @type XM.CreditMemo
  */
  quantityUnit: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type Number
  */
  quantityInventoryUnitRatio: SC.Record.attr(Number),

  /**
    @type Number
  */
  quantityCredit: SC.Record.attr(Number),

  /**
    @type Number
  */
  price: SC.Record.attr(Number),

  /**
    @type XM.CreditMemo
  */
  priceUnit: SC.Record.toOne('XM.CreditMemo'),

  /**
    @type Number
  */
  priceInventoryUnitRatio: SC.Record.attr(Number),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

});
