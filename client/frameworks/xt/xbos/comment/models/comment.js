// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.Comment = XM.Record.extend(
/** @scope XM.Comment.prototype */ {

  className: 'XM.Comment',

  /**
  @type SC.DateTime
  */
  date: SC.Record.attr(SC.DateTime, {
    /** @private */
    defaultValue: function() {
      return (arguments[0].get('status') === SC.Record.READY_NEW) ? SC.DateTime.create().toFormattedString(SC.DATETIME_ISO8601) : null;
    }
  }),
  
  /**
  @type XM.User
  */
  user: SC.Record.attr(XM.User, {
    /** @private */
    defaultValue: function() {
      return arguments[0].get('status') === SC.Record.READY_NEW ? XM.currentUser() : null;
    }
  }),
  
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
  isPublic: SC.Record.attr(Boolean, {
    /** @private */
    defaultValue: function() {
      return XM.session.metrics ? XM.session.metrics.get('CommentPublicDefault') : NO;
    }
  }),

  /**
  @type Boolean
  */
  canUpdate: NO,

  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = this.get('validateErrors'), err;

    // Validate Comment Type
    err = XM.errors.findProperty('code', 'xt1003');
    this.updateErrors(err, SC.none(this.get('commentType')));

    return errors;
  }.observes('commentType'),

});

