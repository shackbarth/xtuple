// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.1
*/

XM.Contact = XM.Document.extend(
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
      return arguments[0].get('status') === SC.Record.READY_NEW
        ? XM.Record.nextNumber.call(arguments[ 0 ], 'ContactNumber')
        : null
        ;
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
  @type XM.ContactAssignment
  */
  contacts: XM.Record.toMany('XM.ContactAssignment', {
    isNested: YES
  }),
    
  /**
  @type XM.ItemAssignment
  */
  items: XM.Record.toMany('XM.ItemAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.FileAssignment
  */
  files: XM.Record.toMany('XM.FileAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.ImageAssignment
  */
  images: XM.Record.toMany('XM.ImageAssignment', {
    isNested: YES
  }),
  
  /**
  @type XM.ImageAssignment
  */
  urls: XM.Record.toMany('XM.UrlAssignment', {
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
