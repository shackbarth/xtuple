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

XM.Payables = XM.Object.extend( XM.Settings,
/** @scope XM.Payables.prototype */ {

  className: 'XM.Payables',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextPaybleNumberBinding: '*settings.NextAPMemoNumber',

  /**
    @type Boolean
  */
  isAchEnabledBinding: '*settings.ACHEnabled',

  /**
    @type String
  */
  nextACHBatchNumberBinding: '*settings.NextACHBatchNumber',
  
  /**
    @type String
  */
  achCompanyIdBinding: '*settings.ACHCompanyId',
  
  /**
    @type Number
  */
  achCompanyIdTypeBinding: '*settings.ACHCompanyIdType',

  /**
    @type Boolean
  */
  achCompanyNameBinding: '*settings.ACHCompanyName',

  /**
    @type Boolean
  */  
  achDefaultSuffixBinding: '*settings.ACHDefaultSuffix',

  /**
    @type Boolean
  */  
  eftRoutingRegexBinding: '*settings.EFTRoutingRegex',
  
  /**
    @type String
  */
  eftFunctionBinding: '*settings.EFTFunction',
  
  /**
    @type String
  */  
  isReqireVendorInvoiceBinding: '*settings.ReqInvMiscVoucher',

  /**
    @type Boolean
  */ 
  recurringVoucherBufferBinding: '*settings.RecurringVoucherBuffer'
  
}) ;

XM.payables = XM.Payables.create();


