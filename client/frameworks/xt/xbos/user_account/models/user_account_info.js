// ==========================================================================
// Project:   XM.UserAccountInfo
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends SC.ChildRecord
  @version 0.1

  @todo handle password seeding for cloud and enhanced auth
*/
XM.UserAccountInfo = SC.ChildRecord.extend(
/** @scope XM.UserAccountInfo.prototype */ {

  className: 'XM.UserAccount',
  
  primaryKey: 'username',

  isEditable: NO,
  
  /**
  @type Boolean
  */
  active: SC.Record.attr(Boolean, { 
    isRequired: YES 
  }),
  
  /**
  @type String
  */
  propername: SC.Record.attr(String,  { isRequired: YES, } ),

});
