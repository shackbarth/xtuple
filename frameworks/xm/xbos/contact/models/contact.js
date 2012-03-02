// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/__generated__/_contact');
sc_require('mixins/core_documents');

/** @class

  (Document your Model here)

  @extends XM._Contact
  @version 0.1
*/

XM.Contact = XM._Contact.extend( XM.CoreDocuments,
/** @scope XM.Contact.prototype */ {

  number: SC.Record.attr(String, {
    isRequired: YES,
    /** @private */
    defaultValue: function () {
      if(arguments[0].get('status') === SC.Record.READY_NEW) {
        XM.Record.fetchNumber.call(arguments[ 0 ]);
      }
    }
  }),
  
  /**
  A set of all the contact uses on this record.
  
  Append values to this property with plugins by
  adding a new property for each use type with
  observers that add objects to this property.
  See 'XM.CoreDocuments' mixin for example of the
  implementation technique.
  
  @type SC.Set
  */
  uses: function(key, value) {
    if(value) { 
      this._uses = value;
    } else if(!this._documents) { 
      this._uses = SC.Set.create(); 
    }
    
    return this._uses;
  }.property().cacheable(),

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  /**
  @type String
  */
  name: function() {
    var mid = this.get('middleName');
    var suf = this.get('suffix');

    return this.get('firstName') + ' '
         + ((mid && mid.length) ? mid + ' ' : '')
         + this.get('lastName')
         + ((suf && suf.length) ? ' ' + suf : '');
  }.property('firstName', 'middleName', 'lastName', 'suffix').cacheable(),

  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var flen = this.get('firstName') ? this.get('firstName').length : 0,
    llen = this.get('lastName') ? this.get('lastName').length : 0;
    var errors = this.get('validateErrors');
    var nameErr = XT.errors.findProperty('code', 'xt1002');

    // Validate Name
    this.updateErrors(nameErr, !(flen || llen));

    return errors;
  }.observes('firstName', 'lastName'),

});
