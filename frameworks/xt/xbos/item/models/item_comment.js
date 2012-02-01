// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('xbos/comment/models/comment');

/** @class

  Comment for Item.

  @extends XM.Comment
*/

XM.ItemComment = XM.Comment.extend(
/** @scope XM.ItemComment.prototype */ {

  className: 'XM.ItemComment',

  /**
  @type XM.Item
  */
  item: SC.Record.toOne('XM.Item', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
});

