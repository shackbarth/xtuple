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
  toDoStatus: SC.Record.attr(String, {
    /** @private */
    defaultValue: function() {
      return XM.ToDo.NEITHER
    }
  }),

  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
  /* @private */
  accountsLength: 0,
  
  /* @private */
  accountsLengthBinding: '.accounts.length',
  
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
    var errors = this.get('validateErrors'), len, err;

    // Validate Number
    len = this.get('number') ? this.get('number').length : 0;
    err = XM.errors.findProperty('code', 'xt1001');
    this.updateErrors(err, !len);

    // Validate Name
    len = this.get('name') ? this.get('name').length : 0;
    err = XM.errors.findProperty('code', 'xt1002');
    this.updateErrors(err, !len);

    return errors;
  }.observes('number', 'name')

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
