// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

/**
  @scope XM.BankAccount
  @mixin

  This code is automatically generated and will be over-written. Do not edit directly.
*/
XM._BankAccount = {
  /** @scope XM.BankAccount.prototype */
  
  className: 'XM.BankAccount',

  

  // .................................................
  // PRIVILEGES
  //

  privileges: {
    "all": {
      "create": "MaintainBankAccounts",
      "read": "MaintainBankAccounts",
      "update": "MaintainBankAccounts",
      "delete": "MaintainBankAccounts"
    }
  },

  //..................................................
  // ATTRIBUTES
  //
  
  /**
    @type Number
  */
  guid: SC.Record.attr(Number),

  /**
    @type String
  */
  name: SC.Record.attr(String, {
    isRequired: true
  }),

  /**
    @type String
  */
  description: SC.Record.attr(String),

  /**
    @type String
  */
  bankName: SC.Record.attr(String),

  /**
    @type String
  */
  accountNumber: SC.Record.attr(String),

  /**
    @type String
  */
  bankAccountType: SC.Record.attr(String),

  /**
    @type XM.Currency
  */
  currency: SC.Record.toOne('XM.Currency', {
    defaultValue: function() {
      return XM.Currency.BASE;
    }
  }),

  /**
    @type String
  */
  notes: SC.Record.attr(String)

};
