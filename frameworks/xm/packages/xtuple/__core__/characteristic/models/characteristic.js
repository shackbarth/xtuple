// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/characteristic/mixins/_characteristic');

/**
  @class

  @extends XM.Document
*/
XM.Characteristic = XM.Document.extend(XM._Characteristic,
  /** @scope XM.Characteristic.prototype */ {

  // see document mixin for object behavior(s)
  documentKey: 'name',
  
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
    var errors = arguments.callee.base.apply(this, arguments),
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
    var status = this.get('status');

    if (status !== SC.Record.READY_NEW) {
      this.characteristicType.set('isEditable', false);
    }
  }.observes('status')

});

XM.Characteristic.mixin( /** @scope XM.Characteristic */ {

/**
  @static
  @constant
  @type Number
  @default 0
*/
  TEXT: 0,

/**
  @static
  @constant
  @type Number
  @default 1
*/
  LIST: 1,

/**
  @static
  @constant
  @type Number
  @default 2
*/
  DATE: 2

});
