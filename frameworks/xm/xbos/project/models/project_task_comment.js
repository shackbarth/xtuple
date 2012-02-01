// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  Comment for Opportunity.

  @extends XM.Comment
*/
XM.ProjectTaskComment = XM.Comment.extend(
/** @scope XM.ProjectTaskComment.prototype */ {

  className: 'XM.ProjectTaskComment',

  /**
  @type XM.ProjectTask
  */
  projectTask: SC.Record.toOne('XM.ProjectTask', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

