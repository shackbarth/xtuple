// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
//
// ==========================================================================
/*globals XT */

/** @namespace

  A global array that contains all system errors. Specific errors can be looked
  up using the standard enumerator findProperty method:

        var error = XT.errors.findProperty('code', 1000); // Returns 'Unkown Error' object

  Each error in the array is an instance of SC.Error by which code, label and
  description can be referenced.

  The 'ary' array variable at the top of this file should be used to define error properties.
  The array is processed at the start up of the application into SC.Error objects pushed into
  to the XT.errors array.

  @extends SC.Object
*/

XT.errors = [];

/**
  A helper function that accepts an SC.Error or an error code
  integer and creates an alert based on the error.

  XT.errors.alert(error);
  XT.errors.alert(code);

*/
XT.errors.alert = function(error) {
  // If this isn't an error, see if we can look it up
  if(!SC.kindOf(error, SC.Error)) {
    error = XT.errors.findProperty('code', error);
    // Still can't find it, so default to unknown.
    if(error === null) error = XT.errors.findProperty('code', 'xt1000');
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
    description: '_requiredFieldsEmpty'.loc() },
  { code: 'xt1002',
    label: '_recordIncomplete'.loc(),
    description: '_firstOrLastNameRequired'.loc() },
  { code: 'xt1003',
    label: '_recordInvalid'.loc(),
    description: '_currRateDateRangeInvalid'.loc() },
  { code: 'xt1004',
    label: '_recordInvalid'.loc(),
    description: '_currRateExpireDateInvalid'.loc() },
  { code: 'xt1005',
    label: '_recordInvalid'.loc(),
    description: '_taxesGreaterThanAmount'.loc() },  
  { code: 'xt1007',
    label: '_recordConflict'.loc(),
    description: '_recordExistsKey'.loc() },
  { code: 'xt1009',
    label: '_recordInvalid'.loc(),
    description: '_totalMustBePositive'.loc() },
  { code: 'xt1010',
    label: '_recordInvalid'.loc(),
    description: '_noLineItems'.loc() },
  { code: 'xt1011',
    label: '_dataSourceError'.loc(),
    description: '_retreiveError'.loc() },
  { code: 'xt1012',
    label: '_dataSourceError'.loc(),
    description: '_fetchError'.loc() },
  { code: 'xt1013',
    label: '_dataSourceError'.loc(),
    description: '_commitError'.loc() },
  { code: 'xt1014',
    label: '_dataSourceError'.loc(),
    description: '_dispatchError'.loc() },
  { code: 'xt1019',
    label: '_recordInvalid'.loc(),
    description: '_parentIsInvalid'.loc() },
  { code: 'xt1021',
    label: '_recordIncomplete'.loc(),
    description: '_currSymbAbbrRequired'.loc() },
  { code: 'xt1022',
    label: '_recordInvalid'.loc(),
    description: '_uniqueNameRequired'.loc() },
  { code: 'xt1023',
    label: '_recordInvalid'.loc(),
    description: '_optionExistsValue'.loc() },
  { code: 'xt1024', 	
    label: '_recordIncomplete'.loc(),  	
    description: '_charAssignIsRequired'.loc() },
  { code: 'xt1025',
    label: '_recordIncomplete'.loc(),
    description: '_assignedToRequiredForAssigned'.loc() }
];

ary.forEach(function(error) {
  var obj = SC.Error.create({
    code: error.code,
    label: error.label,
    description: error.description
  });

  XT.errors.push(obj);
});
