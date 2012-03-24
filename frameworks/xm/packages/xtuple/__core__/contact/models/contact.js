// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/_contact');

/** @class

  (Document your Model here)

  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Contact = XM.Document.extend(XM._Contact, XM.CoreDocuments,
/** @scope XM.Contact.prototype */ {

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  numberPolicy: XM.AUTO_NUMBER,

  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: YES
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
        llen = this.get('lastName') ? this.get('lastName').length : 0,
        errors = arguments.callee.base.apply(this, arguments),
        nameErr = XM.errors.findProperty('code', 'xt1002');

    // Validate Name
    this.updateErrors(nameErr, !(flen || llen));

    return errors;
  }.observes('firstName', 'lastName'),

});
