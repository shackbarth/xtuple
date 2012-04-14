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
    this.layoutIncomeStatementGroupStatusDidChange();
  },

  /**
    Ensure all children sub-groups are destroyed before current 
    instance is destroyed.
  */
  destroy: function() {
//debugger;
    var store = this.get('store'),
        storeKey = this.get('storeKey'),
        groups = this.getPath('parentRecord.groups'),
        id = this.get('id'),
        group, groupsLength, guid, childStoreKey, childRecord;

    groupsLength = groups.get('length');
    for(var i = 0; i < groupsLength; i++) {
      group = groups.objectAt(i).readAttribute('layoutIncomeStatementGroup');
      if(group === id) {
        guid = groups.objectAt(i).readAttribute('guid');
        childStoreKey = XM.LayoutIncomeStatementGroup.storeKeyFor(guid);
        childRecord = store.materializeRecord(childStoreKey);
        childRecord.destroy();
      }
    }
    store.destroyRecord(null, null, storeKey);
    this.notifyPropertyChange('status');

    return this;
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
    keep layoutGroupRecords[] up-to-date as 
    'layoutIncomeStatementGroup' changes. 
  */

  layoutIncomeStatementGroupDidChange: function() {
    this.getLayoutGroupRecords();
  }.observes('layoutIncomeStatementGroup'),

  /**
    wait for 'parent' group to load before trying to
    get all parent group records.
  */
  layoutIncomeStatementGroupStatusDidChange: function() {
    var status = this.getPath('layoutIncomeStatementGroup.status');
console.log("calling object: " + arguments[1]);
    if(status == SC.Record.READY_CLEAN) {
      this.getLayoutGroupRecords();
    }
  }.observes('*layoutIncomeStatementGroup.status'),

};
