// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
//
// ==========================================================================
/*globals XM */

/** @namespace

  A global array that contains all system errors. Specific errors can be looked
  up using the standard enumerator findProperty method:

        var error = XM.errors.findProperty('code', 1000); // Returns 'Unkown Error' object

  Each error in the array is an instance of SC.Error by which code, label and
  description can be referenced.

  The 'ary' array variable at the top of this file should be used to define error properties.
  The array is processed at the start up of the application into SC.Error objects pushed into
  to the XM.errors array.

  @extends SC.Object
*/

XM.errors = [];

/**
  A helper function that accepts an SC.Error or an error code
  integer and creates an alert based on the error.

  XM.errors.alert(error);
  XM.errors.alert(code);

*/
XM.errors.alert = function(error) {
  // If this isn't an error, see if we can look it up
  if(!SC.kindOf(error, SC.Error)) {
    error = XM.errors.findProperty('code', error);
    // Still can't find it, so default to unknown.
    if(error === null) error = XM.errors.findProperty('code', 'xt1000');
  }

  SC.AlertPane.error({
    caption: error.get('label'),
    message: '_errorCode'.loc() + ': ' + error.get('code'),
    description: error.get('description')
  });
};

// TO DO: Move this to the database?
var ary = [
  { code: 'xt1000',
    label: '_unknownError'.loc(),
    description: '_errorIsUnknown'.loc() },
  { code: 'xt1001',
    label: '_recordIncomplete'.loc(),
    description: '_numberIsRequired'.loc() },
  { code: 'xt1002',
    label: '_recordIncomplete'.loc(),
    description: '_nameIsRequired'.loc() },
  { code: 'xt1003',
    label: '_recordIncomplete'.loc(),
    description: '_commentTypeIsRequired'.loc() },
  { code: 'xt1004',
    label: '_recordIncomplete'.loc(),
    description: '_characteristicIsRequired'.loc() },
  { code: 'xt1005',
    label: '_recordIncomplete'.loc(),
    description: '_contactIsRequired'.loc() },
  { code: 'xt1006',
    label: '_recordIncomplete'.loc(),
    description: '_accountIsRequired'.loc() },
  { code: 'xt1007',
    label: '_recordConflict'.loc(),
    description: '_recordExistsNumber'.loc() },
  { code: 'xt1008',
    label: '_recordConflict'.loc(),
    description: '_recordExistsCode'.loc() }
];

ary.forEach(function(error) {
  var obj = SC.Error.create({
    code: error.code,
    label: error.label,
    description: error.description
  });

  XM.errors.push(obj);
});
