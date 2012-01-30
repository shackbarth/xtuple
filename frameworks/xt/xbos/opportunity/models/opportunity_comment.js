// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  Comment for Opportunity.

  @extends XM.Comment
*/
XM.OpportunityComment = XM.Comment.extend(
/** @scope XM.OpportunityComment.prototype */ {

  className: 'XM.OpportunityComment',

  /**
  @type XM.Opportunity
  */
  opportunity: SC.Record.toOne('XM.Opportunity', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

