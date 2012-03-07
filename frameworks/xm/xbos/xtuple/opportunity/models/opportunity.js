// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_opportunity');
sc_require('mixins/core_documents');

/**
  @class

  @extends XM._Opportunity
  @extends XM.CoreDocuments
*/
XM.Opportunity = XM._Opportunity.extend( XM.CoreDocuments, 
  /** @scope XM.Opportunity.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  /* @private */
  _opportunitiesLength: 0,
  
  /* @private */
  _opportunitiesLengthBinding: '.opportunities.length',
  
  /* @private */
  _opportunitiesDidChange: function() {
    var documents = this.get('documents'),
        opportunities = this.get('opportunities');

    documents.addEach(opportunities);    
  }.observes('opportunitiesLength') 

});
