// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XM */

/** @mixin
  
*/

XM.LayoutFinancialStatement = {
  
  /**
    Stores parent-group records for view-layer drop down.
    Selected value will set the percentLayoutIncomeStatementGroup
    property.
  */
  layoutGroupRecords: null,

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  // .................................................
  // METHODS
  //
  
  initMixin: function() {

    /**
      must be defined this way to prevent 
      property values being overwritten 
      and mirroring across all instances.
    */
    this.layoutGroupRecords = [];
    this.getLayoutGroupRecords();

  },

  /**
    Called on instantiation and when the 'layoutIncomeStatementGroup'
    property changes.
    Will push parent-group records into layoutGroupRecords
    property.
  */
  getLayoutGroupRecords: function() {
    var layoutGroupRec = this.get('layoutIncomeStatementGroup'),
        recs = this.get('layoutGroupRecords'),
        idx;

    while(layoutGroupRec) {

      /**
        Fail-safe to prevent duplicate records from being pushed
        into layoutGroupRecords array.
      */
      idx = recs.lastIndexOf(layoutGroupRec);
      if(idx === -1) {
        recs.push(layoutGroupRec);
      }
      layoutGroupRec = layoutGroupRec.get('layoutIncomeStatementGroup');
    }
  },

  //..................................................
  // OBSERVERS
  //
  
  /**
    keep layoutGroupRecords[] up-to-date if 
    'layoutIncomeStatementGroup' changes. 
  */
  layoutIncomeStatementGroupDidChange: function() {
    this.getLayoutGroupRecords();
  }.observes('layoutIncomeStatementGroup'),

};
