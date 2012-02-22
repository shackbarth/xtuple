// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/core_documents');

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.1
*/

XM.Contact = XM.Document.extend( XM.CoreDocuments,
/** @scope XM.Contact.prototype */ {

  className: 'XM.Contact',
  
  nestedRecordNamespace: XM,

  createPrivilege: 'MaintainPersonalContacts MaintainAllContacts'.w(),
  readPrivilege:   'ViewPersonalContacts ViewAllContacts'.w(),
  updatePrivilege: 'MaintainPersonalContacts MaintainAllContacts'.w(),
  deletePrivilege: 'MaintainPersonalContacts MaintainAllContacts'.w(),

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
  @type String
  */
  honorific: SC.Record.attr(String),
  
  /**
  @type String
  */
  firstName: SC.Record.attr(String),
  
  /**
  @type String
  */
  middleName: SC.Record.attr(String),
  
  /**
  @type String
  */
  lastName: SC.Record.attr(String),
  
  /**
  @type String
  */
  suffix: SC.Record.attr(String),
  
  /**
  @type String
  */
  jobTitle: SC.Record.attr(String),
  
  /**
  @type String
  */
  initials: SC.Record.attr(String),
  
  /**
  @type String
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: YES,
  }),
  
  /**
  @type String
  */
  phone: SC.Record.attr(String),
  
  /**
  @type String
  */
  alternate:SC.Record.attr(String),
  
  /**
  @type String
  */
  fax: SC.Record.attr(String),
  
  /**
  @type String
  */
  primaryEmail: SC.Record.attr(String),
  
  /**
  @type String
  */
  webAddress: SC.Record.attr(String),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String),
  
  /**
  @type XM.UserAccount
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', { 
    isNested: YES 
  }),
  
  /**
  @type Number
  */
  address: SC.Record.toOne('XM.AddressInfo', { 
    isNested: YES 
  }),
  
  /**
  @type XM.ContactEmail
  */
  email: SC.Record.toMany('XM.ContactEmail', {
    isNested: YES,
    inverse:  'contact',
  }),
  
  /**
  @type XM.ContactCharacteristic
  */
  characteristics: SC.Record.toMany('XM.ContactCharacteristic', {
    isNested: YES,
    inverse: 'contact',
  }),
  
  /**
  @type XM.ContactComment
  */
  comments: XM.Record.toMany('XM.ContactComment', {
    isNested: YES,
    inverse: 'contact',
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
  @type XM.ContactContact
  */
  contacts: SC.Record.toMany('XM.ContactContact', {
    isNested: YES
  }),
    
  /**
  @type XM.ContactItem
  */
  items: SC.Record.toMany('XM.ContactItem', {
    isNested: YES
  }),
  
  /**
  @type XM.ContactFile
  */
  files: SC.Record.toMany('XM.ContactFile', {
    isNested: YES
  }),
  
  /**
  @type XM.ContactImage
  */
  images: SC.Record.toMany('XM.ContactImage', {
    isNested: YES
  }),
  
  /**
  @type XM.ContactUrl
  */
  urls: SC.Record.toMany('XM.ContactUrl', {
    isNested: YES
  }),

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
