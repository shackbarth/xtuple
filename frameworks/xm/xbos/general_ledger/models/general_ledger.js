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

XM.GeneralLedger = XM.Object.extend( XM.Settings,
/** @scope XM.GeneralLedger.prototype */ {

  className: 'XM.GeneralLedger',
  
  privilege: 'ConfigureGL',

  /**
    @type Boolean
  */  
  useCompany: false,

  /**
    @type Boolean
  */  
  useCompanyIsEnabled: function() {
    var len = this.get('companyAccountsLength');
    
    if(len) {
      this.set('useCompany', true);
      return false;
    }
    
    return true;
  }.property('companyAccountsLength', 'useCompany'),

  /**
    @type Number
  */  
  companySizeBinding: '*settings.GLCompanySize',

  /**
    @type Boolean
  */  
  useProfitCenters: false,

  /**
    @type Boolean
  */  
  useProfitCentersIsEnabled: function() {
    var len = this.get('profitCenterAccountsLength');
    
    if(len) {
      this.set('useProfitCenters', true);
      return false;
    }
    
    return true;
  }.property('profitCenterAccountsLength', 'useProfitCenters'),

  /**
    @type Boolean
  */
  profitSizeBinding: '*settings.GLProfitSize',
  
  /**
    @type String
  */
  freeFormProfitCentersBinding: '*settings.GLFFProfitCenters',
  
  /**
    @type Number
  */
  mainSizeBinding: '*settings.GLMainSize',

  /**
    @type Boolean
  */  
  useSubAccounts: false,

  /**
    @type Boolean
  */  
  useSubAccountsIsEnabled: function() {
    var len = this.get('subAccountAccountsLength');
    
    if(len) {
      this.set('useSubAccounts', true);
      return false;
    }
    
    return true;
  }.property('subAccountAccountsLength', 'useSubAccounts'),

  /**
    @type Boolean
  */
  subAccountSizeBinding: '*settings.GLSubaccountSize',

  /**
    @type Boolean
  */  
  freeFormSubAccountsBinding: '*settings.GLFFSubaccounts',

  /**
    @type Boolean
  */  
  useJournalsBinding: '*settings.UseJournals',
  
  /**
    @type String
  */
  mandatoryJournalEntryNotesBinding: '*settings.MandatoryGLEntryNotes',
  
  /**
    @type String
  */
  manualForwardUpdateBinding: '*settings.ManualForwardUpdate',
  
  /**
    @type Boolean
  */
  accountAssignmentsIsEnabled: function() {
    return this.get('compmanySize') > 0;
  }.property('companySize').cacheable(),    
    
  /**
    @type String
  */  
  retainedEarningsAccountBinding: '*settings.YearEndEquityAccount',
  
  /**
    @type Boolean
  */
  currencyGainLossAccountBinding: '*settings.CurrencyGainLossAccount',

  /**
    @type Boolean
  */ 
  journalSeriesDiscrepancyAccountBinding: '*settings.GLSeriesDiscrepancyAccount',

  /**
    @type String
  */  
  currencyExchangeSenseBinding: '*settings.CurrencyExchangeSense',

  /**
    @type String
  */
  interfaceInventoryIsEnabledBinding: '*settings.InterfaceToGL', 

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
  companyAccountsLengthBinding: '.companyAccounts.length',
  
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
  profitCenterAccountsLengthBinding: '.profitCenterAccounts.length',  
  
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
  subAccountAccountsLengthBinding: '.subAccountAccounts.length',  
  
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
    } else if(size > 0) this.set('useCompany', true);
  }.observes('companySize','retainedEarningsAccount','currencyGainLossAccount','journalSeriesDiscrepancyAccount' ),
  
  /** @private */
  _profitCenterSizeDidChange: function() {
    if(this.get('profitSize') > 0) this.set('useProfitCenter', true);
  }.observes('profitSize' ),
 
  /** @private */
  _subAccountSizeDidChange: function() {
    if(this.get('subAccountSize') > 0) this.set('useSubAccounts', true);
  }.observes('subAccountSize' )
  
}) ;

XM.generalLedger = XM.GeneralLedger.create();


