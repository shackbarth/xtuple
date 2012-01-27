// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.DocumentAssignment
  @version 0.1
*/

XM.ItemAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.ItemAssignment.prototype */ {

  className: 'XM.ItemAssignment',
  
  /** 
  @type XM.ItemInfo
  */
  item: SC.Record.toOne('XM.ItemInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
