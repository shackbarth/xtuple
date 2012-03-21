// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CreditMemoLine
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CreditMemoLine = {
  /** @scope XM.CreditMemoLine.prototype */
  
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
  creditMemo: SC.Record.toOne('XM.CreditMemo', {
    label: '_creditMemo'.loc()
  }),

  /**
    @type Number
  */
  lineNumber: SC.Record.attr(Number, {
    label: '_lineNumber'.loc()
  }),

  /**
    @type XM.ReasonCode
  */
  reasonCode: SC.Record.toOne('XM.ReasonCode', {
    label: '_reasonCode'.loc()
  }),

  /**
    @type XM.ItemSiteInfo
  */
  itemSite: SC.Record.toMany('XM.ItemSiteInfo', {
    isNested: true,
    inverse: 'guid',
    label: '_itemSite'.loc()
  }),

  /**
    @type Number
  */
  quantityReturned: SC.Record.attr(Number, {
    label: '_quantityReturned'.loc()
  }),

  /**
    @type XM.CreditMemo
  */
  quantityUnit: SC.Record.toOne('XM.CreditMemo', {
    label: '_quantityUnit'.loc()
  }),

  /**
    @type Number
  */
  quantityInventoryUnitRatio: SC.Record.attr(Number, {
    label: '_quantityInventoryUnitRatio'.loc()
  }),

  /**
    @type Number
  */
  quantityCredit: SC.Record.attr(Number, {
    label: '_quantityCredit'.loc()
  }),

  /**
    @type Number
  */
  price: SC.Record.attr(Number, {
    label: '_price'.loc()
  }),

  /**
    @type XM.CreditMemo
  */
  priceUnit: SC.Record.toOne('XM.CreditMemo', {
    label: '_priceUnit'.loc()
  }),

  /**
    @type Number
  */
  priceInventoryUnitRatio: SC.Record.attr(Number, {
    label: '_priceInventoryUnitRatio'.loc()
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String, {
    label: '_notes'.loc()
  })

};
