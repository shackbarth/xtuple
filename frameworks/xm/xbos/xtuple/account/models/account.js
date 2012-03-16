// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/__generated__/_account');
sc_require('mixins/crm_documents');
sc_require('mixins/core_documents');
sc_require('mixins/document');

/** @class

  (Document your Model here)

  @extends XM._Account
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.AccountDocument
  @version 0.2
*/

XM.Account = XM._Account.extend(XM.Document, XM.CoreDocuments, XM.CrmDocuments,
/** @scope XM.Account.prototype */ {
  
  // ..........................................................
  // CALCULATED PROPERTIES
  //

  numberPolicySetting: 'CRMAccountNumberGeneration',
  
  /**
    @type Boolean 
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),
  
  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.dataSource.session.userName;
    }
  }),

  /**
  @type String
  */
  accountType: SC.Record.attr(String, {
    /** @private */
    defaultValue: function() {
      return XM.ToDo.ORGANIZATION
    }
  }),

  isUserAccount: function(key, value) {
    if(value) this._xm_isUserAccount = value;
      return this._xm_isUserAccount !== undefined ?
             this._xm_isUserAccount : this.get('userAccount') !== null;
  }.property('userAccount').cacheable(),

  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
  /* @private */
  accountsLength: 0,
  
  /* @private */
  accountsLengthBinding: '*accounts.length',
  
  /* @private */
  _xm_accountsDidChange: function() {
    var documents = this.get('documents'),
        accounts = this.get('accounts');

    documents.addEach(accounts);    
  }.observes('accountsLength'),

  //...........................................................
  // METHODS
  //

  // ..........................................................
  // OBSERVERS
  //

  validate: function() {
    var errors = this.get('validateErrors'), val, err;

    // Validate Number
    val = this.get('number') ? this.get('number').length : 0;
    err = XM.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !val);

    // Validate Name
    val = this.get('name') ? this.get('name').length : 0;
    err = XM.errors.findProperty('code', 'xt1002');
    this.updateErrors(err, !val);

    // Validate Parent
    if(this.get('parent')) {
      val = this.get('id') !== this.get('parent') ? this.get('parent') : 0;
      err = XM.errors.findProperty('code', 'xt1019');
      this.updateErrors(err, !val);
    }

    // Validate User Account
    if(this.get('isUserAccount')) {
      val = this.get('userAccount') ? this.get('userAccount') : 0;
      err = XM.errors.findProperty('code', 'xt1020');
      this.updateErrors(err, !val);
    }

    return errors;
  }.observes('number', 'name', 'parent', 'isUserAccount', 'userAccount')

});


XM.Account.mixin( /** @scope XM.Account */ {

/**
  Organization type Account.
  
  @static
  @constant
  @type String
  @default O
*/
  ORGANIZATION: 'O',

/**
  Individual type Account.
  
  @static
  @constant
  @type String
  @default I
*/
  INDIVIDUAL: 'I'

});


XM.Account.mixin( /** @scope XM.Account */ {

/**
  Organization type Account.
  
  @static
  @constant
  @type String
  @default O
*/
  ORGANIZATION: 'O',

/**
  Individual type Account.
  
  @static
  @constant
  @type String
  @default I
*/
  INDIVIDUAL: 'I'

});
