// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XT.Object
  @version 0.1
*/

XM.ReceivablesSettings = XT.Object.extend( XM.Settings,
/** @scope XM.ReceivablesSettings.prototype */ {

  className: 'XM.ReceivablesSettings',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextReceivableNumberBinding: SC.Binding.from('*settings.NextARMemoNumber').noDelay(),

  /**
    @type Number
  */
  nextCashReceiptNumberBinding: SC.Binding.from('*settings.NextCashRcptNumber').noDelay(),

  /**
    @type Boolean
  */
  isHideApplyToBalanceBinding: SC.Binding.from('*settings.HideApplyToBalance').noDelay(),
  
  /**
    @type Boolean
  */
  isEnableCustomerDepositsBinding: SC.Binding.from('*settings.EnableCustomerDeposits').noDelay(),
  
  /**
    @type Boolean
  */
  isCreditTaxDiscountBinding: SC.Binding.from('*settings.CreditTaxDiscount').noDelay(),

  /**
    @type String
  */
  remittoNameBinding: SC.Binding.from('*settings.remitto_name').noDelay(),

  /**
    @type String
  */  
  remittoAddress1Binding: SC.Binding.from('*settings.remitto_address1').noDelay(),

  /**
    @type String
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
    @type String
  */ 
  remittoStateBinding: SC.Binding.from('*settings.remitto_state').noDelay(),
  
  /**
    @type String
  */
  remittoPostalCodeBinding: SC.Binding.from('*settings.remitto_zipcode').noDelay(),

  /**
    @type String
  */  
  remittoCountryBinding: SC.Binding.from('*settings.remitto_country').noDelay(),

  /**
    @type String
  */  
  remittoPhoneBinding: SC.Binding.from('*settings.remitto_phone').noDelay(),
  
  /**
    @type Boolean
  */  
  isAutoCreditWarnLateCustomersBinding: SC.Binding.from('*settings.AutoCreditWarnLateCustomers').noDelay(),

  /**
    @type Number
  */ 
  defaultAutoCreditWarnGraceDaysBinding: SC.Binding.from('*settings.DefaultAutoCreditWarnGraceDays').noDelay(),
  
  /**
    @type Number
  */
  recurringInvoiceBufferBinding: SC.Binding.from('*settings.RecurringInvoiceBuffer').noDelay(),
  
  /**
    @type String
  */  
  defaultIncidentStatusBinding: SC.Binding.from('*settings.DefaultARIncidentStatus').noDelay(),

  /**
    @type Boolean
  */  
  isAutoCloseIncidentBinding: SC.Binding.from('*settings.AutoCloseARIncident').noDelay(),

  /**
    @type Number
  */  
  defaultCustomerType: SC.Binding.from('*settings.DefaultCustType').noDelay(),
  
  /**
    @type Number
  */  
  defaultSalesRep: SC.Binding.from('*settings.DefaultSalesRep').noDelay(),
  
  /**
    @type Number
  */  
  defaultShipViaId: SC.Binding.from('*settings.DefaultShipViaId').noDelay(),
  
  /**
    @type Number
  */  
  defaultTerms: SC.Binding.from('*settings.DefaultTerms').noDelay(),
  
  /**
    @type String
  */  
  defaultBalanceMethod: SC.Binding.from('*settings.DefaultBalanceMethod').noDelay(),
  
  /**
    @type Boolean
  */  
  isDefaultPartialShip: SC.Binding.from('*settings.DefaultPartialShip').noDelay(),
  
  /**
    @type Boolean
  */  
  isDefaultBackOrders: SC.Binding.from('*settings.DefaultBackOrders').noDelay(),
  
  /**
    @type Boolean
  */  
  isDefaultFreeFormShiptos: SC.Binding.from('*settings.DefaultFreeFormShiptos').noDelay(),
  
  /**
    @type Number
  */  
  defaultCustomerCreditLimit: SC.Binding.from('*settings.SOCreditLimit').noDelay(),
  
  /**
    @type String
  */  
  defaultCurstomerCreditRate: SC.Binding.from('*settings.SOCreditRate').noDelay()
  
}) ;

XM.receivablesSettings = XM.ReceivablesSettings.create();


