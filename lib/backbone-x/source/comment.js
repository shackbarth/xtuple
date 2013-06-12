/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
    @name XM.CommentType
    @extends XM.Model
  */
  XM.CommentType = XM.Model.extend(/** @lends XM.CommentType# */{

    recordType: 'XM.CommentType',

    defaults: {
      commentsEditable: false
    }

  });

  /**
    @class Used in conjunction with 'XM.Comment.sourceName"
    to determine which comment types are available in a given comment subclass.
    @name XM.CommentTypeSource
    @extends XM.Model
  */
  XM.CommentTypeSource = XM.Model.extend(/** @lends XM.CommentTypeSource# */{

    recordType: 'XM.CommentTypeSource'

  });

  /**
    @class
    @name XM.Source
    @extends XM.Model
  */
  XM.Source = XM.Model.extend(/** @lends XM.Source# */{

    recordType: 'XM.Source'

  });

  /**
    @class Base class for use on comment subclasses.
    @name XM.Comment
    @extends XM.Model
  */
  XM.Comment = XM.Model.extend(/** @lends XM.Comment# */{

    /**
      The name of the source used in conjunction with `CommentTypeSource`
      to determine which comment types are available in a given comment subclass.
    */
    sourceName: "",

    readOnlyAttributes: [
      "created",
      "createdBy"
    ],

    // ..........................................................
    // METHODS
    //

    defaults: function () {
      var result = {};
      result.created = new Date();
      result.createdBy = XM.currentUser.get('username');
      result.text = "";
      return result;
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
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
    @name XM.CommentTypeCollection
    @extends XM.Collection
  */
  XM.CommentTypeCollection = XM.Collection.extend(/** @lends XM.CommentTypeCollection# */{

    model: XM.CommentType

  });

  /**
    @class
    @name XM.SourceCollection
    @extends XM.Collection
  */
  XM.SourceCollection = XM.Collection.extend(/** @lends XM.SourceCollection# */{

    model: XM.Source

  });

}());
