// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_characteristic');

/**
  @class

  @extends XM._Characteristic
*/
XM.Characteristic = XM._Characteristic.extend(
  /** @scope XM.Characteristic.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  // On instantiation, check Type to disable unassociated fields
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.checkType();
  },

  // Check Type to disable unassociated properties
  checkType: function() {
    var type = this.get('characteristicType');

    switch(type) {
      // Use Mask and Validator properties
      case XM.Characteristic.TEXT:
        this.options.set('isEditable', false);
        this.mask.set('isEditable', true);
        this.validator.set('isEditable', true);
        break;
      // Use Options property
      case XM.Characteristic.LIST:
        this.mask.set('isEditable', false);
        this.validator.set('isEditable', false);
        this.options.set('isEditable', true);
        break;
      default:
        this.options.set('isEditable', false);
        this.mask.set('isEditable', false);
        this.validator.set('isEditable', false);
    }
  },

  //..................................................
  // OBSERVERS
  //
  
  /* @private */
  _xm_optionsLength: 0,
  
  /* @private */
  _xm_optionsLengthBinding: SC.Binding.from('*options.length').noDelay(),

  /* @private */
  validate: function() {
    var errors = this.get('validateErrors'),
        optLength = this.getPath('options.length'),
        isValid, err;

    // Validate isItems OR isContacts OR isAddresses
    isValid = this.get('isItems') || this.get('isContacts') || this.get('isAddresses') ? true : false;
    err = XM.errors.findProperty('code', 'xt1024');
    this.updateErrors(err, !isValid);

    // Validate Options List Values for duplicates
    for(var i = 0; i < optLength; i++) {
      for (var j = i+1; j < optLength; j++) {
        isValid = this.get('options').objectAt(i).get('value') !== this.get('options').objectAt(j).get('value') ? true : false;
      }
    }
    err = XM.errors.findProperty('code', 'xt1023');
    this.updateErrors(err, !isValid);

    return errors;
  }.observes('isItems', 'isContacts', 'isAddresses', '_xm_optionsLength'),
  
  // On Type change, disable unassociated properties
  typeDidChange: function() {
    this.checkType();
  }.observes('characteristicType'),

  statusDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.characteristicType.set('isEditable', false);
    }
  }.observes('status')

});

/**
  @static
  @constant
  @type Number
  @default 0
*/
XM.Characteristic.TEXT = 0;

/**
  @static
  @constant
  @type Number
  @default 1
*/
XM.Characteristic.LIST = 1;

/**
  @static
  @constant
  @type Number
  @default 2
*/
XM.Characteristic.DATE = 2;
