// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @mixin

  Applies a standard sequenctil document number for the record type. Requires
  that the ORM on the server side has mapped the number to a order sequence.

  @version 0.1
*/


XM.AccountDocument = {

  number: SC.Record.attr(String, {
    defaultValue: function() {
      var autoGen = XM.session.settings.get('CRMAccountNumberGeneration'),
      status = arguments[0].get('status');

      if((autoGen === 'A' || autoGen === 'O') && 
          status === SC.Record.READY_NEW) {
        return XM.Record.fetchNumber.call(arguments[0]);
      } else return null;
    },
    isRequired: YES
  })
  
};


