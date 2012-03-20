// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.ProjectImage
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._ProjectImage = {
  /** @scope XM.ProjectImage.prototype */
  
  className: 'XM.ProjectImage',

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
    @type XM.Project
  */
  source: SC.Record.toOne('XM.Project', {
    label: '_source'.loc()
  }),

  /**
    @type XM.ImageInfo
  */
  image: SC.Record.toOne('XM.ImageInfo', {
    isNested: true,
    label: '_image'.loc()
  }),

  /**
    @type String
  */
  purpose: SC.Record.attr(String, {
    label: '_purpose'.loc()
  })

};
