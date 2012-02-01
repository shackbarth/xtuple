// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  Comment for Project.

  @extends XM.Comment
*/
XM.ProjectComment = XM.Comment.extend(
/** @scope XM.ProjectComment.prototype */ {

  className: 'XM.ProjectComment',

  /**
  @type XM.Project
  */
  project: SC.Record.toOne('XM.Project', {
    inverse:  'comments',
    isMaster: NO,
  }),

});

