// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_layout_income_statement_group');

/**
  @class

  @extends XM.Record
*/
XM.LayoutIncomeStatementGroup = XT.Record.extend(XM._LayoutIncomeStatementGroup,
  /** @scope XM.LayoutIncomeStatementGroup.prototype */ {

  /**
    Stores parent-group records for view layer drop down.
    Selected value will set the percentLayoutIncomeStatementGroup
    property.
  */
  layoutGroupRecords: [],

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.getLayoutGroupRecords();
  },

  /**
    Called on instantiation and when the layoutIncomeStatementGroup
    property changes.
    Will push parent-group records into layoutGroupRecords
    property.
  */
  getLayoutGroupRecords: function() {
    var layoutGroupRec = this.get('layoutIncomeStatementGroup'),
        idx;

    while(layoutGroupRec) {

      /**
        Fail-safe to prevent duplicate records from being pushed
        into layoutGroupRecords array.
      */
      idx = this.layoutGroupRecords.lastIndexOf(layoutGroupRec);
      if(idx === -1) {
        this.layoutGroupRecords.push(layoutGroupRec);
        layoutGroupRec = layoutGroupRec.get('layoutIncomeStatementGroup');
      }
    }
  },

  //..................................................
  // OBSERVERS
  //

  layoutIncomeStatementGroupDidChange: function() {
    this.getLayoutGroupRecords();
  }.observes('layoutIncomeStatementGroup'),

});
