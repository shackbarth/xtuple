/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.Model
  */
  XM.CommentType = XT.Model.extend({
    /** @scope XM.Comment.prototype */

    recordType: 'XM.CommentType',

    privileges: {
      "all": {
        "create": "MaintainCommentTypes",
        "read": true,
        "update": "MaintainCommentTypes",
        "delete": "MaintainCommentTypes"
      }
    },

    defaults: {
      commentsEditable: false,
      order: 0
    },

    requiredAttributes: [
      "name",
      "commentType",
      "commentsEditable",
      "order"
    ]

  });

  /**
    @class
    
    Base class for use on comment sub classes.
  
    @extends XT.Model
  */
  XM.Comment = XT.Model.extend({
    /** @scope XM.Comment.prototype */

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

    relations: [{
      type: Backbone.HasOne,
      key: 'commentType',
      relatedModel: 'XM.CommentType',
      includeInJSON: 'id'
    }],

    // ..........................................................
    // METHODS
    //

    defaults: function () {
      var result = {},
        publicDefault = XT.session.getSettings().get('CommentPublicDefault');
      result.created = new Date();
      result.createdBy = XM.currentUser.get('username');
      result.isPublic = publicDefault || false;
      return result;
    },

    isReadOnly: function () {
      var commentType = this.get('commentType'),
        isNew = this.getStatus() === XT.Model.READY_NEW,
        editable = isNew || (commentType &&
          commentType.get('commentsEditable'));

      return !editable || XT.Model.prototype.isReadOnly.apply(this, arguments);
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
  
    @extends XT.Collection
  */
  XM.CommentTypeCollection = XT.Collection.extend({
    /** @scope XM.CommentTypeCollection.prototype */

    model: XM.CommentType

  });

}());
