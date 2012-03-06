// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/settings');

/** @class

  (Document your Model here)

  @extends XM.Object
  @version 0.1
*/

XM.Receivables = XM.Object.extend( XM.Settings,
/** @scope XM.Receivables.prototype */ {

  className: 'XM.Receivables',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextReceivableNumberBinding: '*settings.NextARMemoNumber',

  /**
    @type Boolean
  */
  nextCashRcptNumberBinding: '*settings.NextCashRcptNumber',

  /**
    @type String
  */
  isHideApplyToBalanceBinding: '*settings.HideApplyToBalance',
  
  /**
    @type String
  */
  isEnableCustomerDepositsBinding: '*settings.EnableCustomerDeposits',
  
  /**
    @type Number
  */
  isCreditTaxDiscountBinding: '*settings.CreditTaxDiscount',

  /**
    @type Boolean
  */
  remittoNameBinding: '*settings.remitto_name',

  /**
    @type Boolean
  */  
  remittoAddress1Binding: '*settings.remitto_address1',

  /**
    @type Boolean
  */  
  remittoAddress2Binding: '*settings.remitto_address2',
  
  /**
    @type String
  */
  remittoAddress3Binding: '*settings.remitto_address3',
  
  /**
    @type String
  */  
  remittoCityBinding: '*settings.remitto_city',

  /**
    @type Boolean
  */ 
  remittoStateBinding: '*settings.remitto_state',
  
  /**
    @type Boolean
  */
  remittoPostalCodeBinding: '*settings.remitto_zipcode',

  /**
    @type Boolean
  */  
  remittoCountryBinding: '*settings.remitto_country',

  /**
    @type Boolean
  */  
  remittoPhoneBinding: '*settings.remitto_phone',
  
  /**
    @type String
  */  
  isAutoCreditWarnLateCustomersBinding: '*settings.AutoCreditWarnLateCustomers',

  /**
    @type Boolean
  */ 
  defaultAutoCreditWarnGraceDaysBinding: '*settings.DefaultAutoCreditWarnGraceDays',
  
  /**
    @type String
  */
  recurringInvoiceBufferBinding: '*settings.RecurringInvoiceBuffer',
  
  /**
    @type Boolean
  */  
  defaultIncidentStatusBinding: '*settings.DefaultARIncidentStatus',

  /**
    @type Boolean
  */  
  isAutoCloseIncidentBinding: '*settings.AutoCloseARIncident'
  
}) ;

XM.receivables = XM.Receivables.create();


