// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('mixins/core_documents');

/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.2
*/

XM.Account = XM.Document.extend( XM.CoreDocuments,
/** @scope XM.Account.prototype */ {

  className: 'XM.Account',

  createPrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),
  readPrivilege:   'ViewPersonalCRMAccounts ViewAllCRMAccounts',
  updatePrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),
  deletePrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),

  number: SC.Record.attr(String, {
    defaultValue: function() {
    /*
      TODO: Uncomment this when session metrics work again
      
      var autoGen = XM.session.metrics.get('CRMAccountNumberGeneration'),
      status = arguments[0].get('status');

      if(autoGen && status === SC.Record.READY_NEW) {
        return XM.Record.nextNumber.call(arguments[ 0 ], "CRMAccountNumber");
      } else return null;
      */
    },
    isRequired: YES
  }),

  /**
  @type String
  */
  name: SC.Record.attr(String, {
    isRequired: YES
  }),
  
  /**
  @type Boolean
  */
  isActive: SC.Record.attr(Boolean),
  
  /**
  @type String
  */
  type: SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: 'O'
  }),
  
  /**
  @type XM.UserAccount
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: YES
  }),

  /**
  @type XM.Account
  */
  parent: SC.Record.toOne('XM.AccountInfo', {
    isNested: YES
  }),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String),
  
  /**
  @type XM.Contact
  */
  primaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: YES
  }),
  
  /**
  @type XM.Contact
  */
  secondaryContact: SC.Record.toOne('XM.ContactInfo', {
    isNested: YES
  }),
  
  /**
  @type XM.AccountCharacteristic
  */
  characteristics: SC.Record.toMany('XM.AccountCharacteristic', {
    isNested: YES,
    inverse: 'account',
  }),
  
  /**
  @type XM.AccountComment
  */
  comments: SC.Record.toMany('XM.AccountComment', {
    isNested: YES,
    inverse: 'account'
  }),
  
  /**
  @type XM.UserAccount
  */
  userAccount: XM.Record.toOne('XM.UserAccountInfo', {
    isNested: YES,
    isRole: YES
  }),
  
  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
    
  /**
  @type XM.AccountContact
  */
  contacts: SC.Record.toMany('XM.AccountContact', {
    isNested: YES
  }),
    
  /**
  @type XM.AccountItem
  */
  items: SC.Record.toMany('XM.AccountItem', {
    isNested: YES
  }),
  
  /**
  @type XM.AccountFile
  */
  files: SC.Record.toMany('XM.AccountFile', {
    isNested: YES
  }),
  
  /**
  @type XM.AccountImage
  */
  images: SC.Record.toMany('XM.AccountImage', {
    isNested: YES
  }),
  
  /**
  @type XM.AccountUrl
  */
  urls: SC.Record.toMany('XM.AccountUrl', {
    isNested: YES
  }),
  
  /**
  @type XM.AccountAssignment
  */
  accounts: XM.Record.toMany('XM.AccountAccount', {
    isNested: YES
  }),
  
  /* @private */
  _accountsLength: 0,
  
  /* @private */
  _accountsLengthBinding: '.accounts.length',
  
  /* @private */
  _accountsDidChange: function() {
    var documents = this.get('documents'),
        accounts = this.get('accounts');

    documents.addEach(accounts);    
  }.observes('accountsLength'),

  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = this.get('validateErrors'), len, err;

    // Validate Number
    len = this.get('number') ? this.get('number').length : 0,
    err = XT.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !len);

    // Validate Name
    len = this.get('name') ? this.get('name').length : 0,
    err = XT.errors.findProperty('code', 'xt1002');
    this.updateErrors(err, !len);

    return errors;
  }.observes('number', 'name')


});

