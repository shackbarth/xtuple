// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_opportunity');
sc_require('mixins/crm_documents');
sc_require('mixins/core_documents');
sc_require('mixins/document');

/**
  @class

  @extends XM._Opportunity
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Opportunity = XM._Opportunity.extend(XM.Document, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Opportunity.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
    @type Boolean 
  */
  isActive: SC.Record.attr(Boolean, {
    defaultValue: true
  }),
  
  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
    }
  }),

  /**
    @type SC.DateTime
  */
  startDate: SC.Record.attr(SC.DateTime, {
    defaultValue: function() {
      return SC.DateTime.create();
    }
  }),

  /* @private */
  accountsLength: 0,
  
  /* @private */
  accountsLengthBinding: SC.Binding.from('.opportunities.length').noDelay(),
  
  /* @private */
  opportunitiesLength: 0,
  
  /* @private */
  opportunitiesLengthBinding: SC.Binding.from('.opportunities.length').noDelay(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /* @private */
  _xm_accountsDidChange: function() {
    var documents = this.get('documents'),
        accounts = this.get('accounts');

    documents.addEach(accounts);    
  }.observes('accountsLength'),
  
  /* @private */
  _xm_opportunitiesDidChange: function() {
    var documents = this.get('documents'),
        opportunities = this.get('opportunities');

    documents.addEach(opportunities);    
  }.observes('opportunitiesLength')

});

