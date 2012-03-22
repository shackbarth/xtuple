// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/project/mixins/_project_task');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM.Record
*/
XM.ProjectTask = XM.Record.extend(XM._ProjectTask, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.ProjectTask.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    @field
    @type Number
  */
  balanceHours: function() {
    var value = this.get('budgetedHours') - this.get('actualHours');
    return value;
  }.property('budgetedHours','actualHours'),


  /**
    @field
    @type Number
  */
  balanceExpenses: function() {
    var value = this.get('budgetedExpenses') - this.get('actualExpenses');
    return value;
  }.property('budgetedExpenses','actualExpenses'),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

