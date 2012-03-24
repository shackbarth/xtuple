// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */
sc_require('mixins/_account');

/** @class

  (Document your Model here)

  @extends XM.CoreDocuments
  @extends XM.AccountDocument
*/

XM.Account = XM.AccountDocument.extend(XM.CoreDocuments, XM._Account,
/** @scope XM.Account.prototype */ {
  
  // ..........................................................
  // CALCULATED PROPERTIES
  //

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
    var errors = arguments.callee.base.apply(this, arguments);

    // Validate Parent
    if(this.get('parent')) {
      isValid = this.get('id') !== this.get('parent') ? this.get('parent') : 0;
      err = XM.errors.findProperty('code', 'xt1019');
      this.updateErrors(err, !isValid);
    }

    // Validate User Account
    if(this.get('isUserAccount')) {
      isValid = this.get('userAccount') ? this.get('userAccount') : 0;
      err = XM.errors.findProperty('code', 'xt1020');
      this.updateErrors(err, !isValid);
    }

    return errors;
  }.observes('parent', 'isUserAccount', 'userAccount')

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

