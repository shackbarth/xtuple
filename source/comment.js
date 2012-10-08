/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.CommentType = XM.Model.extend(/** @lends XM.CommentType.prototype */{

    recordType: 'XM.CommentType',

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

    @extends XM.Model
  */
  XM.CommentTypeSource = XM.Model.extend(/** @lends XM.CommentTypeSource.prototype */{

    recordType: 'XM.CommentTypeSource'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.Source = XM.Model.extend(/** @lends XM.Source.prototype */{

    recordType: 'XM.Source'

  });

  /**
    @class

    Base class for use on comment sub classes.

    @extends XM.Model
  */
  XM.Comment = XM.Model.extend(/** @lends XM.Comment.prototype */{

    /**
      The name of the source used in conjunction with `CommentTypeSource`
      to determine which comment types are available in a given comment sub class.
    */
    sourceName: "",

    readOnlyAttributes: [
      "created",
      "createdBy"
    ],

    requiredAttributes: [
      "commentType"
    ],

    // ..........................................................
    // METHODS
    //

    defaults: function () {
      var result = {},
        publicDefault = XT.session.getSettings().get('CommentPublicDefault');
      result.created = new Date();
      result.createdBy = XM.currentUser.get('username');
      result.isPublic = publicDefault || false;
      result.text = "";
      return result;
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      this.on('statusChange', this.statusChanged);
      this.statusChanged();
    },

    isReadOnly: function () {
      var commentType = this.get('commentType'),
        isNew = this.getStatus() === XM.Model.READY_NEW,
        editable = isNew || (commentType &&
          commentType.get('commentsEditable'));

      return !editable || XM.Model.prototype.isReadOnly.apply(this, arguments);
    },

    statusChanged: function () {
      var status = this.getStatus(),
        K = XM.Model;
      if (status === K.READY_CLEAN) {
        this.setReadOnly('commentType');
      }
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CommentTypeCollection = XM.Collection.extend(/** @lends XM.CommentTypeCollection.prototype */{

    model: XM.CommentType

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SourceCollection = XM.Collection.extend(/** @lends XM.SourceCollection.prototype */{

    model: XM.Source

  });

}());
