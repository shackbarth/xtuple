/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
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
      includeInJSON: 'guid'
    }],

    // ..........................................................
    // METHODS
    //

    defaults: function () {
      var result = {},
        publicDefault = XT.session.getSettings().get('CommentPublicDefault');
      result.created = new Date();
      result.createdBy = XM.currentUser;
      result.isPublic = publicDefault ? publicDefault : false;
      return result;
    },

    isReadOnly: function (value) {
      var commentType = this.get('commentType'),
        editable = commentType && commentType.get('commentsEditable');

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