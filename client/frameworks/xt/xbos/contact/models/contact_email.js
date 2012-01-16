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

XM.ContactEmail = XM.Record.extend(
/** @scope XM.ContactEmail.prototype */ {

  className: 'XM.ContactEmail',

  /**
  @type XM.Contact
  */
  contact:   SC.Record.toOne('XM.Contact', {
    inverse:  'email',
    isMaster: NO
  }),
  
  /**
  @type String
  */
  email:     SC.Record.attr(String, {
    isRequired: YES
  }),

});

