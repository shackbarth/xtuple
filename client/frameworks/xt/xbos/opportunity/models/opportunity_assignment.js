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

XM.OpportunityAssignment = XM.DocumentAssignment.extend( 
/** @scope XM.OpportunityAssignment.prototype */ {

  className: 'XM.OpportunityAssignment',
  
  /** 
  @type XM.OpportunityInfo
  */
  opportunity: SC.Record.toOne('XM.OpportunityInfo', { 
    isNested: YES,
    isRequired: YES 
  })

});
