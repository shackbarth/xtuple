// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.1
*/

XM.ImageAssignment = XM.DocumentAssignment.extend(
/** @scope XM.ImageAssignment.prototype */ {

  className: 'XM.ImageAssignment',
  
  /** 
  @type XM.ImageInfo
  */
  image: SC.Record.toOne('XM.ImageInfo', { 
    isNested: YES,
    isRequired: YES 
  })
  
});
