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
  layoutGroupRecords: null,

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.layoutGroupRecords = [];
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

  statusDidChange: function() {
    var status = this.get('status');

    /**
      Make sure labels' isEditable property is 
      synced with the associated boolean flag
      condition.
    */
    if(status === SC.Record.READY_NEW) {
      this.isShowSubtotalDidChange();
      this.isAlternateSubtotalDidChange();
    }
  }.observes('status'),

  layoutIncomeStatementGroupDidChange: function() {
    this.getLayoutGroupRecords();
  }.observes('layoutIncomeStatementGroup'),

  isShowSubtotalDidChange: function() {
    var isShowSubtotal = this.get('isShowSubtotal');

    this.set('isShowDifference', isShowSubtotal);
    this.set('isShowBudget', isShowSubtotal);
    if(!isShowSubtotal) this.set('isAlternateSubtotal', isShowSubtotal);
    this.isAlternateSubtotal.set('isEditable', isShowSubtotal);
  }.observes('isShowSubtotal'),

  isAlternateSubtotalDidChange: function() {
    var isAlternateSubtotal = this.get('isAlternateSubtotal');

    this.alternateSubtotalLabel.set('isEditable', isAlternateSubtotal);
  .observes('isAlternateSubtotal'),

});
