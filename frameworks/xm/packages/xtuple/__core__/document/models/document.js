// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  Provides special number handling capabilities for documents.

  @extends XT.Record
*/

XM.Document = XT.Record.extend(
/** @scope XM.Document.prototype */ {

  /**
    Walk like a duck.
  */
  isDocument: true,

  /**
    The unique property for the document, typically a number, code or name. 
    This property will be checked when a user edits it to ensure it has not already 
    been used by another record of the same type.
    
    @default number
  */
  documentKey: 'number',

  /**
    If set, the number Policy property will be set based on the number
    generation policy on this setting.
  */
  numberPolicySetting: null,

  /**
  Holds all of the document assignments.
  */
  documents: [],
  
  // ..........................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Number generation method for the document key that can be one of three constants:
      XM.MANUAL_NUMBER
      XM.AUTO_NUMBER
      XM.AUTO_OVERRIDE_NUMBER
    
    Can be inferred from the setting that controls this for a given record type
    if it is set.
    
    @seealso numberPolicySetting
    @default XM.MANUAL_NUMBER
  */
  numberPolicy: function(key, value) {
    var setting =  this.get('numberPolicySetting');
    if(value === undefined && setting) {
      value = XT.session.get('settings').get(setting);
    }
    this._numberPolicy = value ? value : XM.MANUAL_NUMBER;
    return this._numberPolicy;
  }.property().cacheable(),

  // ..........................................................
  // METHODS
  //
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    var docKey = this.get('documentKey');
    dv = function() {
      var record = arguments[0],
          docKey = record.get('documentKey'),
          status = record.get('status'),
          numberPolicy = record.get('numberPolicy');
      if((numberPolicy === XM.AUTO_NUMBER || 
          numberPolicy === XM.AUTO_OVERRIDE_NUMBER) && 
          status === SC.Record.READY_NEW) {
        XT.Record.fetchNumber.call(record, docKey);
      } else return '';
    }
    this[docKey].defaultValue = dv;
    this[docKey].set('isRequired', true);
    this.addObserver(docKey, this.keyDidChange);

    /**
      Build observers for document assignment properties 
    */
    this.getAssignmentProperties();

  },
  
  /**
    Called whenever the document key property changes. Does the following:
      * Locks editing when number has been set and number policy is XM.AUTO_NUMBER
      * Releases a generated number if user has over-ridden an auto generated number
      * Checks for duplicate key violitions by calling findExisting().
      
    @seealso XM.Document.findExisting()
  */
  keyDidChange: function() {  
    var record = this;
        status = record.get('status'),
        docKey = record.get('documentKey'),
        number = record.get(docKey),
        policy = record.get('numberPolicy');   

    // if generated and automatic, lock it down
    if(record._xt_numberGen && policy === 'A') this[docKey].set('isEditable', false);
   
    // release the fetched number if applicable 
    if(record._xt_numberGen && record._xt_numberGen != number) {
      XT.Record.releaseNumber.call(record, record._xt_numberGen); 
      record._xt_numberGen = null;
    }    

    // For manually edited numbers, check for conflicts with existing
    if(number && (status == SC.Record.READY_NEW || status == SC.Record.READY_DIRTY))  {
      if(this._xt_numberGen && this._xt_numberGen == number) return;

      // callback
      callback = function(err, result) {
        if(!err) {
          var err = XT.errors.findProperty('code', 'xt1007'),
              id = record.get('id'),
              isConflict = result ? result !== id  : false;          
          record.updateErrors(err, isConflict);
        }
      }        
      
      // function call
      XT.Record.findExisting.call(record, docKey, number, callback);
    }
  },

  destroy: function() {
    var record = this,
        status = this.get('status');
    
    /* release the number if applicable */
    if(status === SC.Record.READY_NEW && record._xt_numberGen) {
      XT.Record.releaseNumber.call(record, record._xt_numberGen); 
      record._xt_numberGen = null;
    }
    arguments.callee.base.apply(this, arguments);
  },

  /**
    Called to determine XM.DocumentAssignment attributes.
  */
  _xm_getAssignmentProperties: function() {
    if(!this._assignmentProperties) {
      var prop, propType, obj;

      for(key in this) {
        prop = this[key];
        if(prop && prop.isRecordAttribute) {
          propType = this.prop.get('type');
          obj = SC.objectForPropertyPath(propType);
          if(obj && obj.isDocumentAssignment) {
            this._assignmentProperties.push(key);
          }
        }
      }
    }
    return this_assignmentProperties;
  },

  /**
    Called whenever the length of a document type array changes.
  */
  _xm_assignmentDidChange: function() {

  },

  // ..........................................................
  // OBSERVERS
  //

  /** @private */
  _xm_numberPolicyDidChange: function() {
    var policy = this.get('numberPolicy'),
        docKey = this.get('documentKey');
    this[docKey].set('isEditable', policy !== 'A');
  }.observes('numberPolicy')

});





