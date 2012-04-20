// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XT.Object
*/

XM.LedgerSettings = XT.Object.extend( XM.Settings,
/** @scope XM.LedgerSettings.prototype */ {

  className: 'XM.LedgerSettings',
  
  privilege: 'ConfigureGL',

  /**
    @type Boolean
  */  
  isUseCompany: false,

  /**
    @type Boolean
  */  
  isUseCompanyEnabled: function() {
    var len = this.get('companyAccountsLength');
    
    if(len) {
      this.set('isUseCompany', true);
      return false;
    }
    
    return true;
  }.property('companyAccountsLength', 'isUseCompany'),

  /**
    @type Number
  */  
  companySize: null,

  /**
    @type Boolean
  */  
  isUseProfitCenters: false,

  /**
    @type Boolean
  */  
  isUseProfitCentersEnabled: function() {
    var len = this.get('profitCenterAccountsLength');
    
    if(len) {
      this.set('isUseProfitCenters', true);
      return false;
    }
    
    return true;
  }.property('profitCenterAccountsLength', 'isUseProfitCenters'),

  /**
    @type Boolean
  */
  profitSize: null,
  
  /**
    @type String
  */
  isFreeFormProfitCenters: null,
  
  /**
    @type Number
  */
  mainSize: null,

  /**
    @type Boolean
  */  
  isUseSubAccounts: false,

  /**
    @type Boolean
  */  
  isUseSubAccountsEnabled: function() {
    var len = this.get('subAccountAccountsLength');
    
    if(len) {
      this.set('isUseSubAccounts', true);
      return false;
    }
    
    return true;
  }.property('subAccountAccountsLength', 'isUseSubAccounts'),

  /**
    @type Boolean
  */
  subAccountSize: null,

  /**
    @type Boolean
  */  
  isFreeFormSubAccounts: null,

  /**
    @type Boolean
  */  
  isUseJournals: null,
  
  /**
    @type String
  */
  isMandatoryJournalEntryNotes: null,
  
  /**
    @type String
  */
  isManualForwardUpdate: null,
  
  /**
    @type Boolean
  */
  accountAssignmentsIsEnabled: function() {
    return this.get('compmanySize') > 0;
  }.property('companySize').cacheable(),    
    
  /**
    @type String
  */  
  retainedEarningsAccount: null,
  
  /**
    @type Boolean
  */
  currencyGainLossAccount: null,

  /**
    @type Boolean
  */ 
  journalSeriesDiscrepancyAccount: null,

  /**
    @type String
  */  
  currencyExchangeSense: null,

  /**
    @type String
  */
  isInventoryInterfaceEnabled: null, 

  // ..........................................................
  // PRIVATE
  //  
  
  /** @private */
  companyAccounts: function() {
    if(!this._companyAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountInfo, {
        conditions: "company MATCHES {regexp}",
        parameters: { regexp: regExp },
        rowLimit: 1
      });
      this._companyAccounts = XT.store.find(qry);
    }
    
    return this._companyAccounts;
  }.property().cacheable(),
  
  /** @private */
  companyAccountsLength: 0,
  
  /** @private */
  profitCenterAccounts: function() {
    if(!this._profitCenterAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountInfo, {
        conditions: "profitCenter MATCHES {regexp}",
        parameters: { regexp: regExp },
        rowLimit: 1
      });
      this._profitCenterAccounts = XT.store.find(qry);
    }
    
    return this._profitCenterAccounts;
  }.property().cacheable(),
  
  /** @private */
  profitCenterAccountsLength: 0,  
  
  /** @private */
  subAccountAccounts: function() {
    if(!this._subAccountAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountInfo, {
        conditions: "subAccount MATCHES {regexp}",
        parameters: { regexp: regExp },
        rowLimit: 1
      });
      this._subAccountAccounts = XT.store.find(qry);
    }
    
    return this._subAccountAccounts;
  }.property().cacheable(),
  
  /** @private */
  subAccountAccountsLength: 0,  
  
  // ..........................................................
  // METHODS
  //
  
  init: function() {
    arguments.callee.base.apply(this, arguments);

    // bind all the properties to settings
    var settings = this.get('settings');
    SC.Binding.from('*settings.GLCompanySize', XT.session).to('companySize', this).noDelay().connect();
    SC.Binding.from('*settings.GLProfitSize', XT.session).to('profitSize', this).noDelay().connect();
    SC.Binding.from('*settings.GLFFProfitCenters', XT.session).to('isFreeFormProfitCenters', this).noDelay().connect();
    SC.Binding.from('*settings.GLMainSize', XT.session).to('mainSize', this).noDelay().connect();
    SC.Binding.from('*settings.GLSubaccountSize', XT.session).to('subAccountSize', this).noDelay().connect();
    SC.Binding.from('*settings.GLFFSubaccounts', XT.session).to('isFreeFormSubAccounts', this).noDelay().connect();
    SC.Binding.from('*settings.UseJournals', XT.session).to('isUseJournals', this).noDelay().connect();
    SC.Binding.from('*settings.MandatoryGLEntryNotes', XT.session).to('isMandatoryJournalEntryNotes', this).noDelay().connect();
    SC.Binding.from('*settings.ManualForwardUpdate', XT.session).to('isManualForwardUpdate', this).noDelay().connect();
    SC.Binding.from('*settings.YearEndEquityAccount', XT.session).to('retainedEarningsAccount', this).noDelay().connect();
    SC.Binding.from('*settings.CurrencyGainLossAccount', XT.session).to('currencyGainLossAccount', this).noDelay().connect();
    SC.Binding.from('*settings.GLSeriesDiscrepancyAccount', XT.session).to('journalSeriesDiscrepancyAccount', this).noDelay().connect();
    SC.Binding.from('*settings.CurrencyExchangeSense', XT.session).to('currencyExchangeSense', this).noDelay().connect();
    SC.Binding.from('*settings.InterfaceToGL', XT.session).to('isInventoryInterfaceEnabled', this).noDelay().connect();

    // local bindings
    SC.Binding.from('*companyAccounts.length', this).to('companyAccountsLength', this).noDelay().connect();
    SC.Binding.from('*profitCenterAccounts.length', this).to('profitCenterAccountsLength', this).noDelay().connect();
    SC.Binding.from('*subAccountAccounts.length', this).to('subAccountAccountsLength', this).noDelay().connect(); 
  },
  
  // ..........................................................
  // OBSERVERS
  //
  
  /** @private */
  _glCompanySizeDidChange: function() {
    var size = this.get('glCompanySize');
    
    if(size === 0) {
      this.set('retainedEarningsAccount', -1);
      this.set('currencyGainLossAccount', -1);
      this.set('journSeriesDiscrepancyAccount', -1);
    } else if(size > 0) this.set('isUseCompany', true);
  }.observes('companySize','retainedEarningsAccount','currencyGainLossAccount','journalSeriesDiscrepancyAccount' ),
  
  /** @private */
  _profitCenterSizeDidChange: function() {
    if(this.get('profitSize') > 0) this.set('isUseProfitCenter', true);
  }.observes('profitSize' ),
 
  /** @private */
  _subAccountSizeDidChange: function() {
    if(this.get('subAccountSize') > 0) this.set('isUseSubAccounts', true);
  }.observes('subAccountSize' )
  
}) ;

// FIXME - queries can't run until application is ready
//XM.ledgerSettings = XM.LedgerSettings.create();
