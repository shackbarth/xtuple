// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/comment/models/comment');

/** @class

  Comment for Contact.

  @extends XM.Comment
*/
XM.ContactComment = XM.Comment.extend(
/** @scope XM.ContactComment.prototype */ {

  className: 'XM.ContactComment',

  /**
  @type XM.Contact
  */
  contact: SC.Record.toOne('XM.Contact', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

