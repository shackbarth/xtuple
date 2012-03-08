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
XM._CommentType = XM.Record.extend(
  /** @scope XM._CommentType.prototype */ {
  
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
  name: SC.Record.attr(String),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isSystem: SC.Record.attr(Boolean),

  /**
    @type Boolean
  */
  commentsEditable: SC.Record.attr(Boolean),

  /**
    @type Number
  */
  order: SC.Record.attr(Number)

});
