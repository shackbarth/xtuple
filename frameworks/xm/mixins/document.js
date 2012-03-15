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
    
    Can be inferred from the setting that controls this for a given record type
    if it is set.
    
    @seealso numberPolicySetting
    @default XM.AUTO_NUMBER
  */
  numberPolicy: function(key, value) {
    var setting =  this.get('numberPolicySetting');
    if(value === undefined && setting) {
      value = XM.session.get('settings').get(setting);
    }
    this._numberPolicy = value ? value : XM.AUTO_NUMBER;
    return this._numberPolicy;
  }.property().cacheable(),
  
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
  
    isRequired: true
  }),

  // ..........................................................
  // METHODS
  //

  destroy: function() {
    var record = this,
        status = this.get('status');
    
    /* release the number if applicable */
    if(status === SC.Record.READY_NEW && record._xm_numberGen) {
      XM.Record.releaseNumber.call(record, record._xm_numberGen); 
      record._xm_numberGen = null;
    }
    arguments.callee.base.apply(this, arguments);
  },

  // ..........................................................
  // OBSERVERS
  //

  /** @private */
  _xm_numberPolicyDidChange: function() {
    var policy = this.get('numberPolicy');
    this.number.set('isEditable', policy !== 'A');
  }.observes('numberPolicy'),

  /** @private */
  _xm_numberDidChange: function() {  
    var record = this;
        status = record.get('status'),
        number = record.get('number'),
        policy = record.get('numberPolicy');   
   
    // if generated and automatic, lock it down
    if(record._xm_numberGen && policy === 'A') this.number.set('isEditable', false);
   
    // release the fetched number if applicable 
    if(record._xm_numberGen && record._xm_numberGen !== number - 0) {
      XM.Record.releaseNumber.call(record, record._xm_numberGen); 
      record._xm_numberGen = null;
    }    
      
    // For manually edited numbers, check for conflicts with existing
    if(number && (!record._xm_numberGen || number != record._xm_numberGen)) {
      // callback
      callback = function(err, result) {
        if(!err) {
          var err = XM.errors.findProperty('code', 'xt1007'),
              id = record.get('id'),
              isConflict = result ? result !== id  : false;          
          record.updateErrors(err, isConflict);
        }
      }        
      
      // function call
      XM.Record.findExisting.call(record, 'number', number, callback);
    }

  }.observes('number')
}





