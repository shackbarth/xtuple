// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
/** @class

  (Document your Model here)

  @extends XM.Record
  @version 0.2
*/

XM.State = XM.Record.extend(
/** @scope XM.State.prototype */ {

  className: 'XM.State',

  createPrivilege: 'MaintainStates',
  readPrivilege:   'MaintainStates',
  updatePrivilege: 'MaintainStates',
  deletePrivilege: 'MaintainStates',

   
  /**
  @type String
  */
  name: SC.Record.attr(String, { isRequired: YES }),
  
  /**
  @type String
  */
  abbreviation: SC.Record.attr(String, { isRequired: YES }),
  
  /**
  @type XM.Country
  */
  country: SC.Record.toOne('XM.Country', {
    inverse:  'states',
    isMaster: NO
  }),

}) ;

