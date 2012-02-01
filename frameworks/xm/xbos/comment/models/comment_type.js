// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.CommentType = XM.Record.extend(
/** @scope XM.CommentType.prototype */ {

  className: 'XM.CommentType',

  createPrivilege: 'MaintainCommentTypes',
  readPrivilege:   'MaintainCommentTypes',
  updatePrivilege: 'MaintainCommentTypes',
  deletePrivilege: 'MaintainCommentTypes',

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  description: SC.Record.attr(String),
  
  /**
  @type Boolean
  */
  isSystem: SC.Record.attr(Boolean),
  
  /**
  @type Boolean
  */
  commentsEditable: SC.Record.attr(Boolean),
  
  /**
  @type Number
  */
  order: SC.Record.attr(Number),

}) ;
