// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.2
*/
XM.ProjectInfo = XM.Record.extend(
    /** @scope XM.ProjectInfo.prototype */ {

  className: 'XM.ProjectInfo',
  
  isEditable: NO,

  /**
  @type String
  */
  number: SC.Record.attr(String),

  /**
  @type String
  */
  name: SC.Record.attr(String),
  
  /**
  @type String
  */
  projectStatus: SC.Record.attr(String)
  
});