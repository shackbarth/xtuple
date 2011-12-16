// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
sc_require('models/comment/comment');
/** @class

  Comment for Accounts.

  @extends XM.Comment
*/
XM.AccountComment = XM.Comment.extend(
/** @scope XM.AccountComment.prototype */ {

  className: 'XM.AccountComment',

  /**
  @type XM.Account
  */
  account: SC.Record.toOne('XM.Account', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

