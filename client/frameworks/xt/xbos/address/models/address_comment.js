// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  Comment for Address.

  @extends XM.Comment
*/
XM.AddressComment = XM.Comment.extend(
/** @scope XM.AddressComment.prototype */ {

  className: 'XM.AddressComment',

  /**
  @type XM.Address
  */
  address: SC.Record.toOne('XM.Address', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

