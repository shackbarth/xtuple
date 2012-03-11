// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/__generated__/_account');
sc_require('mixins/core_documents');
sc_require('mixins/account_document');

/** @class

  (Document your Model here)

  @extends XM._Account
  @extends XM.CoreDocuments
  @extends XM.AccountDocument
  @version 0.2
*/

XM.Account = XM._Account.extend(XM.Document, XM.CoreDocuments,
/** @scope XM.Account.prototype */ {
  
  numberPolicySetting: 'CRMAccountNumberGeneration',
  
  // ..........................................................
  // DOCUMENT ASSIGNMENTS
  // 
  
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
