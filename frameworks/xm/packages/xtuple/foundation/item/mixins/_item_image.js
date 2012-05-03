// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ItemImage
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ItemImage = {
  /** @scope XM.ItemImage.prototype */
  
  className: 'XM.ItemImage',

  nestedRecordNamespace: XM,

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": false,
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
    @type XM.Item
  */
  source: SC.Record.toOne('XM.Item'),

  /**
    @type XM.ImageInfo
  */
  image: SC.Record.toOne('XM.ImageInfo', {
    isNested: true
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String)

};
