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
    format: '%Y-%m-%d',
    defaultValue: function() {
      return SC.DateTime.create().toFormattedString('%Y-%m-%d');
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
  validate: function() {
    var errors = this.get('validateErrors'), val, err;

    // Validate Name
    val = this.get('name') ? this.get('name').length : 0;
    err = XM.errors.findProperty('code', 'xt1002');
    this.updateErrors(err, !val);

    // Validate Account
    val = this.get('account') ? this.get('account').length : 0;
    err = XM.errors.findProperty('code', 'xt1006');
    this.updateErrors(err, !val);

    return errors;
  }.observes('name', 'account'),
  
  _xm_assignedToDidChange: function() {
    var assignedTo = this.get('assignedTo'),
        status = this.get('status'),
        assignedDate = SC.DateTime.create();
        console.log('assignedDate unformatted: ' + assignedDate);
        assignedDate = assignedDate.toFormattedString('%Y-%m-%d');
        console.log('assignedDate formatted: ' + assignedDate);
     
    if(status & SC.Record.READY && assignedTo) this.set('assignDate',function() {
       return SC.DateTime.create().toFormattedString('%Y-%m-%d')});
  }.observes('assignedTo'),
  
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

