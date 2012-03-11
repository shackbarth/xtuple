// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @mixin

  Provides special number handling capabilities for documents.

  @version 0.1
*/

XM.Document = {

  /**
    If set, the number Policy property will be set based on the number
    generation policy on this setting.
  */
  numberPolicySetting: null,
  
  // ..........................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Number generation method that can be one of three constants:
      XM.MANUAL_NUMBER
      XM.AUTO_NUMBER
      XM.AUTO_OVERRIDE_NUMBER
    
    Can be bound to the setting that controls this for a given record type.
    
    @default XM.AUTO_NUMBER
  */
  numberPolicy: function(key, value) {
    var setting =  this.get('numberPolicySetting');
    
    if(value === undefined && setting) {
      value = XM.session.get('settings').get(setting);
    }
    
    this._numberPolicy = value ? value : XM.AUTO_NUMBER;
    
    return this._numberPolicy;
  }.property('numberPolicySetting').cacheable(),
  
  number: SC.Record.attr(String, {
    defaultValue: function() {
      var record = arguments[0],
          status = record.get('status'),
          numberPolicy = record.get('numberPolicy');

      if((numberPolicy === XM.AUTO_NUMBER || 
          numberPolicy === XM.AUTO_OVERRIDE_NUMBER) && 
          status === SC.Record.READY_NEW) {
        XM.Record.fetchNumber.call(record);
      } else return '';
    },
    
    isRequired: true,
    
    isEditable: true
  }),

  // ..........................................................
  // METHODS
  //
  
  destroy: function() {
    var record = this,
        status = this.get('status');
    
    if(status === SC.Record.READY_NEW && record._numberGen) {
      XM.Record.releaseNumber.call(record, record._numberGen); 
      record._numberGen = null;
    }
    
    arguments.callee.base.apply(this, arguments);
  },

  // ..........................................................
  // OBSERVERS
  //

  /** @private */
  _xm_numberPolicyDidChange: function() {
    //this.setPath('number.isEditable', numberGen !== 'A');
  }.observes('numberPolicy'),

  /** @private */
  _xm_numberDidChange: function() {
    var record = this;
        status = record.get('status'),
        number = record.get('number'),
        numberPolicy = record.get('numberPolicy');

    if(status & SC.Record.READY && 
       this._numberGen &&
       this._numberGen !== number - 0) {
      // auto generated numbers can not be changed
      if(numberPolicy === XM.AUTO_NUMBER) {
        this.set('number', this._numberGen);
        
      // release the fetched number if over-ride allowed
      } else if(numberPolicy == XM.AUTO_OVERRIDE_NUMBER) {
        XM.Record.releaseNumber.call(record, record._numberGen); 
        record._numberGen = null;
      }
    }
  }.observes('number')
  
}





