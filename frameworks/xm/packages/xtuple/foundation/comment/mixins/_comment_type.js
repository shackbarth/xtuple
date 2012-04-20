// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.CommentType
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._CommentType = {
  /** @scope XM.CommentType.prototype */
  
  className: 'XM.CommentType',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainCommentTypes",
      "read": true,
      "update": "MaintainCommentTypes",
      "delete": "MaintainCommentTypes"
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
  name: SC.Record.attr(String, {
    label: '_name'.loc()
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String, {
    label: '_description'.loc()
  }),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean, {
    label: '_isSystem'.loc()
  }),

  /**
    @type Boolean
  */
  commentsEditable: SC.Record.attr(Boolean, {
    label: '_commentsEditable'.loc()
  }),

  /**
    @type Number
  */
  order: SC.Record.attr(Number, {
    label: '_order'.loc()
  })

};
