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
  nextReceivableNumberBinding: SC.Binding.from('*settings.NextARMemoNumber').noDelay(),

  /**
    @type Boolean
  */
  nextCashRcptNumberBinding: SC.Binding.from('*settings.NextCashRcptNumber').noDelay(),

  /**
    @type String
  */
  isHideApplyToBalanceBinding: SC.Binding.from('*settings.HideApplyToBalance').noDelay(),
  
  /**
    @type String
  */
  isEnableCustomerDepositsBinding: SC.Binding.from('*settings.EnableCustomerDeposits').noDelay(),
  
  /**
    @type Number
  */
  isCreditTaxDiscountBinding: SC.Binding.from('*settings.CreditTaxDiscount').noDelay(),

  /**
    @type Boolean
  */
  remittoNameBinding: SC.Binding.from('*settings.remitto_name').noDelay(),

  /**
    @type Boolean
  */  
  remittoAddress1Binding: SC.Binding.from('*settings.remitto_address1').noDelay(),

  /**
    @type Boolean
  */  
  remittoAddress2Binding: SC.Binding.from('*settings.remitto_address2').noDelay(),
  
  /**
    @type String
  */
  remittoAddress3Binding: SC.Binding.from('*settings.remitto_address3').noDelay(),
  
  /**
    @type String
  */  
  remittoCityBinding: SC.Binding.from('*settings.remitto_city').noDelay(),

  /**
    @type Boolean
  */ 
  remittoStateBinding: SC.Binding.from('*settings.remitto_state').noDelay(),
  
  /**
    @type Boolean
  */
  remittoPostalCodeBinding: SC.Binding.from('*settings.remitto_zipcode').noDelay(),

  /**
    @type Boolean
  */  
  remittoCountryBinding: SC.Binding.from('*settings.remitto_country').noDelay(),

  /**
    @type Boolean
  */  
  remittoPhoneBinding: SC.Binding.from('*settings.remitto_phone').noDelay(),
  
  /**
    @type String
  */  
  isAutoCreditWarnLateCustomersBinding: SC.Binding.from('*settings.AutoCreditWarnLateCustomers').noDelay(),

  /**
    @type Boolean
  */ 
  defaultAutoCreditWarnGraceDaysBinding: SC.Binding.from('*settings.DefaultAutoCreditWarnGraceDays').noDelay(),
  
  /**
    @type String
  */
  recurringInvoiceBufferBinding: SC.Binding.from('*settings.RecurringInvoiceBuffer').noDelay(),
  
  /**
    @type Boolean
  */  
  defaultIncidentStatusBinding: SC.Binding.from('*settings.DefaultARIncidentStatus').noDelay(),

  /**
    @type Boolean
  */  
  isAutoCloseIncidentBinding: SC.Binding.from('*settings.AutoCloseARIncident').noDelay()
  
}) ;

XM.receivables = XM.Receivables.create();


