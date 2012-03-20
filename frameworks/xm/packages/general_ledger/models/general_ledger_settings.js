// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/settings');

/** @class

  (Document your Model here)

  @extends XM.Object
*/

XM.GeneralLedgerSettings = XM.Object.extend( XM.Settings,
/** @scope XM.GeneralLedgerSettings.prototype */ {

  className: 'XM.GeneralLedger',
  
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
  companySizeBinding: SC.Binding.from('*settings.GLCompanySize').noDelay(),

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
  profitSizeBinding: SC.Binding.from('*settings.GLProfitSize').noDelay(),
  
  /**
    @type String
  */
  isFreeFormProfitCentersBinding: SC.Binding.from('*settings.GLFFProfitCenters').noDelay(),
  
  /**
    @type Number
  */
  mainSizeBinding: SC.Binding.from('*settings.GLMainSize').noDelay(),

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
  subAccountSizeBinding: SC.Binding.from('*settings.GLSubaccountSize').noDelay(),

  /**
    @type Boolean
  */  
  isFreeFormSubAccountsBinding: SC.Binding.from('*settings.GLFFSubaccounts').noDelay(),

  /**
    @type Boolean
  */  
  isUseJournalsBinding: SC.Binding.from('*settings.UseJournals').noDelay(),
  
  /**
    @type String
  */
  isMandatoryJournalEntryNotesBinding: SC.Binding.from('*settings.MandatoryGLEntryNotes').noDelay(),
  
  /**
    @type String
  */
  isManualForwardUpdateBinding: SC.Binding.from('*settings.ManualForwardUpdate').noDelay(),
  
  /**
    @type Boolean
  */
  accountAssignmentsIsEnabled: function() {
    return this.get('compmanySize') > 0;
  }.property('companySize').cacheable(),    
    
  /**
    @type String
  */  
  retainedEarningsAccountBinding: SC.Binding.from('*settings.YearEndEquityAccount').noDelay(),
  
  /**
    @type Boolean
  */
  currencyGainLossAccountBinding: SC.Binding.from('*settings.CurrencyGainLossAccount').noDelay(),

  /**
    @type Boolean
  */ 
  journalSeriesDiscrepancyAccountBinding: SC.Binding.from('*settings.GLSeriesDiscrepancyAccount').noDelay(),

  /**
    @type String
  */  
  currencyExchangeSenseBinding: SC.Binding.from('*settings.CurrencyExchangeSense').noDelay(),

  /**
    @type String
  */
  isInventoryInterfaceEnabledBinding: SC.Binding.from('*settings.InterfaceToGL').noDelay(), 

  // ..........................................................
  // PRIVATE
  //  
  
  /** @private */
  companyAccounts: function() {
    if(!this._companyAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountBrowse, {
        conditions: "company MATCHES {regexp}",
        parameters: { regexp: regExp }
      });
      this._companyAccounts = XM.store.find(qry);
    }
    
    return this._companyAccounts;
  }.property().cacheable(),
  
  /** @private */
  companyAccountsLengthBinding: '*companyAccounts.length',
  
  /** @private */
  profitCenterAccounts: function() {
    if(!this._profitCenterAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountBrowse, {
        conditions: "profitCenter MATCHES {regexp}",
        parameters: { regexp: regExp }
      });
      this._profitCenterAccounts = XM.store.find(qry);
    }
    
    return this._profitCenterAccounts;
  }.property().cacheable(),
  
  /** @private */
  profitCenterAccountsLengthBinding: '*profitCenterAccounts.length',  
  
  /** @private */
  subAccountAccounts: function() {
    if(!this._subAccountAccounts) {
      var qry, regExp = new RegExp('.');
      
      qry = SC.Query.local(XM.LedgerAccountBrowse, {
        conditions: "subAccount MATCHES {regexp}",
        parameters: { regexp: regExp }
      });
      this._subAccountAccounts = XM.store.find(qry);
    }
    
    return this._subAccountAccounts;
  }.property().cacheable(),
  
  /** @private */
  subAccountAccountsLengthBinding: '*subAccountAccounts.length',  
  
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

// DOES NOT WORK
// XM.ready(function() { setTimeout(function() { XM.generalLedger = XM.GeneralLedger.create(); }, 4000); });
