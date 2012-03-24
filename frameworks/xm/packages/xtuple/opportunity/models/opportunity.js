// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_opportunity');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM.Document
  @extends XM.CoreDocuments
  @extends XM.CrmDocuments
*/
XM.Opportunity = XM.Document.extend(XM._Opportunity, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Opportunity.prototype */ {

  numberPolicy: XM.AUTO_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //

  /* @private */
  accountsLength: 0,
  
  /* @private */
  accountsLengthBinding: SC.Binding.from('*opportunities.length').noDelay(),
  
  /* @private */
  opportunitiesLength: 0,
  
  /* @private */
  opportunitiesLengthBinding: SC.Binding.from('*opportunities.length').noDelay(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  _xm_assignedToDidChange: function() {
    var assignedTo = this.get('assignedTo'),
        status = this.get('status');
     
    if(status & SC.Record.READY && assignedTo) this.set('assignDate', SC.DateTime.create());
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
