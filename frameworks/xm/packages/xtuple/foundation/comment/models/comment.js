// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @clas

  (Document your Model here)

  @extends XT.Record
*/

XM.Comment = XT.Record.extend(
/** @scope XM.Comment.prototype */ {

  className: 'XM.Comment',

  /**
    Walk like a duck.
  */
  isComment: true,
  
  /**
  @type XT.DateTime
  */
  created: SC.Record.attr(XT.DateTime, {
    /** @private */
    defaultValue: function() {
      return (arguments[0].get('status') === SC.Record.READY_NEW) ? XT.DateTime.create().toFormattedString(XT.DateTime_ISO8601) : null;
    }
  }),
  
  /**
  @type {String}
  */
  createdBy: SC.Record.attr('XM.UserAccount', {
    /** @private */
    defaultValue: function() {
      if(arguments[0].get('status') === SC.Record.READY_NEW) return XM.DataSource.session.userName;
    }
  }),
  
  /**
  @type Boolean
  */
  isEditable: function() {
    return arguments.callee.base.apply(this, arguments);
  }.property('status', 'commentType').cacheable(),
  
  /**
  @type Boolean
  */
  isPublic: SC.Record.attr(Boolean, {
    /** @private */
    defaultValue: function() {
      return XT.session.settings ? XT.session.settings.get('CommentPublicDefault') : NO;
    }
  }),

  // ..........................................................
  // METHODS
  //

  canUpdate: function() {
    var commentType = this.get('commentType'),
        createdBy = this.get('createdBy'),
        status = this.get('status'),
        canUpdate = arguments.callee.base.apply(this, arguments);
    
    return commentType && commentType.get('commentsEditable') && canUpdate;
  },
  
  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = this.get('validateErrors'), err;

    // Validate Comment Type
    err = XT.errors.findProperty('code', 'xt1003');
    this.updateErrors(err, SC.none(this.get('commentType')));

    return errors;
  }.observes('commentType')

});

