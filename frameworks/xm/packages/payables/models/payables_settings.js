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

XM.PayablesSettings = XM.Object.extend( XM.Settings,
/** @scope XM.Payables.prototype */ {

  className: 'XM.PayablesSettings',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextPayableNumberBinding: SC.Binding.from('*settings.NextAPMemoNumber').noDelay(),

  /**
    @type Boolean
  */
  isAchEnabledBinding: SC.Binding.from('*settings.ACHEnabled').noDelay(),

  /**
    @type String
  */
  nextACHBatchNumberBinding: SC.Binding.from('*settings.NextACHBatchNumber').noDelay(),
  
  /**
    @type String
  */
  achCompanyIdBinding: SC.Binding.from('*settings.ACHCompanyId').noDelay(),
  
  /**
    @type Number
  */
  achCompanyIdTypeBinding: SC.Binding.from('*settings.ACHCompanyIdType').noDelay(),

  /**
    @type Boolean
  */
  achCompanyNameBinding: SC.Binding.from('*settings.ACHCompanyName').noDelay(),

  /**
    @type Boolean
  */  
  achDefaultSuffixBinding: SC.Binding.from('*settings.ACHDefaultSuffix').noDelay(),

  /**
    @type Boolean
  */  
  eftRoutingRegexBinding: SC.Binding.from('*settings.EFTRoutingRegex').noDelay(),
  
  /**
    @type String
  */
  eftFunctionBinding: SC.Binding.from('*settings.EFTFunction').noDelay(),
  
  /**
    @type String
  */  
  isReqireVendorInvoiceBinding: SC.Binding.from('*settings.ReqInvMiscVoucher').noDelay(),

  /**
    @type Boolean
  */ 
  recurringVoucherBufferBinding: SC.Binding.from('*settings.RecurringVoucherBuffer').noDelay()
  
}) ;

XM.payables = XM.Payables.create();


