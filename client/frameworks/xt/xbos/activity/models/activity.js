// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.1
*/

XM.Activity = XM.Document.extend(
/** @scope XM.Activity.prototype */ {

  className: 'XM.Activity',

  nestedRecordNamespace: XM,
  
  /** 
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),
  
  /** 
  @type XM.UserAccount
  */
  owner: SC.Record.toOne('XM.UserAccount', {
    isNested: YES
  }),
  
  /** 
  @type XM.UserAccount
  */
  assignedTo: SC.Record.toOne('XM.UserAccount', {
    isNested: YES
  }),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String)

});
