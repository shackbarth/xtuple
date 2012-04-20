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

XM.PaymentsSettings = XT.Object.extend( XM.Settings,
/** @scope XM.PaymentsSettings.prototype */ {

  className: 'XM.PaymentsSettings',
  
  privilege: 'ConfigureGL',

  /**
    @type Number
  */  
  nextPayableNumber: null,

  /**
    @type Boolean
  */
  isAchEnabled: null,

  /**
    @type String
  */
  nextACHBatchNumber: null,
  
  /**
    @type String
  */
  achCompanyId: null,
  
  /**
    @type Number
  */
  achCompanyIdType: null,

  /**
    @type Boolean
  */
  achCompanyName: null,

  /**
    @type Boolean
  */  
  achDefaultSuffix: null,

  /**
    @type Boolean
  */  
  eftRoutingRegex: null,
  
  /**
    @type String
  */
  eftFunction: null,
  
  /**
    @type String
  */  
  isReqireVendorInvoice: null,

  /**
    @type Boolean
  */ 
  recurringVoucherBuffer: null,
  
  init: function() {
    arguments.callee.base.apply(this, arguments);

    // bind all the properties to settings
    var settings = this.get('settings');
    SC.Binding.from('*settings.NextAPMemoNumber', XT.session).to('nextPayableNumber', this).noDelay().connect();
    SC.Binding.from('*settings.ACHEnabled', XT.session).to('isAchEnabled', this).noDelay().connect();
    SC.Binding.from('*settings.NextACHBatchNumber', XT.session).to('nextACHBatchNumber', this).noDelay().connect();
    SC.Binding.from('*settings.ACHCompanyId', XT.session).to('achCompanyId', this).noDelay().connect();
    SC.Binding.from('*settings.ACHCompanyIdType', XT.session).to('achCompanyIdType', this).noDelay().connect();
    SC.Binding.from('*settings.ACHCompanyName', XT.session).to('achCompanyName', this).noDelay().connect();
    SC.Binding.from('*settings.ACHDefaultSuffix', XT.session).to('achDefaultSuffix', this).noDelay().connect();
    SC.Binding.from('*settings.EFTRoutingRegex', XT.session).to('eftRoutingRegex', this).noDelay().connect();
    SC.Binding.from('*settings.EFTFunction', XT.session).to(' eftFunction', this).noDelay().connect();
    SC.Binding.from('*settings.ReqInvMiscVoucher', XT.session).to('isReqireVendorInvoice', this).noDelay().connect();
    SC.Binding.from('*settings.RecurringVoucherBuffer', XT.session).to('recurringVoucherBuffer', this).noDelay().connect();
  }
  
}) ;

XM.paymentsSettings = XM.PaymentsSettings.create();


