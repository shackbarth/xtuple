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
XM._AddressComment = XM.Record.extend(
  /** @scope XM._AddressComment.prototype */ {
  
  className: 'XM.AddressComment',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": true,
      "read": true,
      "update": "EditOthersComments",
      "delete": false
    },
    "personal": {
      "update": "EditOwnComments",
      "properties": [
        "createdBy"
      ]
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
    @type XM.Address
  */
  address: SC.Record.toOne('XM.Address'),

  /**
    @type XM.CommentType
  */
  commentType: SC.Record.toOne('XM.CommentType'),

  /**
    @type String
  */
  text: SC.Record.attr(String),

  /**
    @type Boolean
  */
  isPublic: SC.Record.attr(Boolean),

  /**
    @type Date
  */
  created: SC.Record.attr(Date),

  /**
    @type String
  */
  createdBy: SC.Record.attr(String)

});
