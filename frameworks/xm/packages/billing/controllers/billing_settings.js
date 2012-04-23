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

XM.BillingSettings = XT.Object.extend( XM.Settings,
/** @scope XM.BillingSettings.prototype */ {

  className: 'XM.BillingSettings',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextReceivableNumber: null,

  /**
    @type Number
  */
  nextCashReceiptNumber: null,

  /**
    @type Boolean
  */
  isHideApplyToBalance: null,
  
  /**
    @type Boolean
  */
  isEnableCustomerDeposits: null,
  
  /**
    @type Boolean
  */
  isCreditTaxDiscount: null,

  /**
    @type String
  */
  remittoName: null,

  /**
    @type String
  */  
  remittoAddress1: null,

  /**
    @type String
  */  
  remittoAddress2: null,
  
  /**
    @type String
  */
  remittoAddress3: null,
  
  /**
    @type String
  */  
  remittoCity: null,

  /**
    @type String
  */ 
  remittoState: null,
  
  /**
    @type String
  */
  remittoPostalCode: null,

  /**
    @type String
  */  
  remittoCountry: null,

  /**
    @type String
  */  
  remittoPhone: null,
  
  /**
    @type Boolean
  */  
  isAutoCreditWarnLateCustomers: null,

  /**
    @type Number
  */ 
  defaultAutoCreditWarnGraceDays: null,
  
  /**
    @type Number
  */
  recurringInvoiceBuffer: null,
  
  /**
    @type String
  */  
  defaultIncidentStatus: null,

  /**
    @type Boolean
  */  
  isAutoCloseIncident: null,

  /**
    @type Number
  */  
  defaultCustomerType: null,
  
  /**
    @type Number
  */  
  defaultSalesRep: null,
  
  /**
    @type Number
  */  
  defaultShipViaId: null,
  
  /**
    @type Number
  */  
  defaultTerms: null,
  
  /**
    @type String
  */  
  defaultBalanceMethod: null,
  
  /**
    @type Boolean
  */  
  isDefaultPartialShip: null,
  
  /**
    @type Boolean
  */  
  isDefaultBackOrders: null,
  
  /**
    @type Boolean
  */  
  isDefaultFreeFormShiptos: null,
  
  /**
    @type Number
  */  
  defaultCustomerCreditLimit: null,
  
  /**
    @type String
  */  
  defaultCurstomerCreditRate: null,
  
  
  init: function() {
    arguments.callee.base.apply(this, arguments);

    // bind all the properties to settings
    var settings = this.get('settings');
    SC.Binding.from('*settings.NextARMemoNumber', XT.session).to('nextReceivableNumber', this).noDelay().connect();
    SC.Binding.from('*settings.NextCashRcptNumber', XT.session).to('nextCashReceiptNumber', this).noDelay().connect();
    SC.Binding.from('*settings.HideApplyToBalance', XT.session).to('isHideApplyToBalance', this).noDelay().connect();
    SC.Binding.from('*settings.EnableCustomerDeposits', XT.session).to('isEnableCustomerDeposits', this).noDelay().connect();
    SC.Binding.from('*settings.CreditTaxDiscount', XT.session).to('isCreditTaxDiscount', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_name', XT.session).to('remittoName', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_address1', XT.session).to('remittoAddress1', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_address2', XT.session).to('remittoAddress2', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_address3', XT.session).to('remittoAddress3', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_city', XT.session).to('remittoCity', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_state', XT.session).to('remittoState', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_state', XT.session).to('remittoState', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_zipcode', XT.session).to('remittoPostalCode', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_country', XT.session).to('remittoCountry', this).noDelay().connect();
    SC.Binding.from('*settings.remitto_phone', XT.session).to('remittoPhone', this).noDelay().connect();
    SC.Binding.from('*settings.AutoCreditWarnLateCustomers', XT.session).to('isAutoCreditWarnLateCustomers', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultAutoCreditWarnGraceDays', XT.session).to('defaultAutoCreditWarnGraceDays', this).noDelay().connect();
    SC.Binding.from('*settings.RecurringInvoiceBuffer', XT.session).to('nextReceivableNumber', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultARIncidentStatus', XT.session).to('defaultIncidentStatus', this).noDelay().connect();
    SC.Binding.from('*settings.AutoCloseARIncident', XT.session).to('isAutoCloseIncident', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultCustType', XT.session).to('defaultCustomerType', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultSalesRep', XT.session).to('defaultSalesRep', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultShipViaId', XT.session).to('defaultShipViaId', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultTerms', XT.session).to('defaultTerms', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultBalanceMethod', XT.session).to('defaultBalanceMethod', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultPartialShip', XT.session).to('isDefaultPartialShip', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultBackOrders', XT.session).to('isDefaultBackOrders', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultFreeFormShiptos', XT.session).to('isDefaultFreeFormShiptos', this).noDelay().connect();
    SC.Binding.from('*settings.SOCreditLimit', XT.session).to('defaultCustomerCreditLimit', this).noDelay().connect();
    SC.Binding.from('*settings.SOCreditRate', XT.session).to('defaultCurstomerCreditRate', this).noDelay().connect();
  }
  
}) ;

XM.billingSettings = XM.BillingSettings.create();


