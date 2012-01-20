// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  (Document your Model here)

  @extends XM.Document
  @version 0.2
*/

XM.Account = XM.Document.extend(
/** @scope XM.Account.prototype */ {

  className: 'XM.Account',

  createPrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),
  readPrivilege:   'ViewPersonalCRMAccounts ViewAllCRMAccounts',
  updatePrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),
  deletePrivilege: 'MaintainPersonalCRMAccounts MaintainAllCRMAccounts'.w(),

  number: SC.Record.attr(String, {
    defaultValue: function() {
      var autoGen = XM.session.metrics.get('CRMAccountNumberGeneration'),
      status = arguments[0].get('status');

      if(autoGen && status === SC.Record.READY_NEW) {
        return XM.Record.nextNumber.call(arguments[ 0 ], "CRMAccountNumber");
      } else return null;
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
  owner: SC.Record.toOne('XM.UserAccount'{
    isNested: YES
  }),

  /**
  @type XM.Account
  */
  parent: SC.Record.toOne('XM.Account'{
    isNested: YES
  }),
  
  /**
  @type String
  */
  notes: SC.Record.attr(String),
  
  /**
  @type XM.Contact
  */
  primaryContact: SC.Record.toOne('XM.Contact', {
    isNested: YES
  }),
  
  /**
  @type XM.Contact
  */
  secondaryContact: SC.Record.toOne('XM.Contact', {
    isNested: YES
  }),
  
  /**
  @type XM.Contact
  */
  contacts: SC.Record.toMany('XM.Contact', { 
    isNested: YES,
    inverse: 'account',
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
    inverse: 'account',
  }),
  
  /**
  @type XM.UserAccount
  */
  userAccount: XM.Record.toOne('XM.UserAccount', {
    isNested: YES,
    isRole: YES
  },

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
  }.observes('number', 'name'),

});

