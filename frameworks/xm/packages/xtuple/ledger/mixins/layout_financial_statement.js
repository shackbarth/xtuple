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
  
  subGroups: function() {
    var groups = this.getPath('parentRecord.groups');

    return groups.filterProperty('layoutIncomeStatementGroup', this);
  }.property('groupsLength').cacheable(),

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
//    this.layoutIncomeStatementGroupStatusDidChange();
  },

  /**
    Ensure all sub-group records are marked SC.Record.DESTROYED 
    before current record.
  */
  destroy: function() {
    var store = this.get('store'),
        subGroups = this.get('subGroups'),
        sKey = this.get('storeKey'),
        len, guid, rec, recSKey;

    len = this.getPath('subGroups.length');
    if(len > 0) {
      for(var i = 0; i < len; i++) {
          guid = subGroups.objectAt(i).readAttribute('guid');
          recSKey = XM.LayoutIncomeStatementGroup.storeKeyFor(guid);
          rec = store.materializeRecord(recSKey);
          rec.destroy();
      }
    }
    store.destroyRecord(null, null, sKey);
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
    var store = this.get('store'),
        groupId = this.readAttribute('layoutIncomeStatementGroup'),
        recs = this.get('layoutGroupRecords'),
        groupSKey, groupRec, idx;

    groupSKey = XM.LayoutIncomeStatementGroup.storeKeyExists(groupId);
    groupRec = store.materializeRecord(groupSKey);
    while(groupRec) {

      /**
        Fail-safe to prevent duplicate records from being pushed
        into layoutGroupRecords array.
      */
      idx = recs.lastIndexOf(groupRec);
      if(idx === -1) {
        recs.push(groupRec);
      }
      groupId = groupRec.readAttribute('layoutIncomeStatementGroup')
      if(groupId) {
        groupSKey = XM.LayoutIncomeStatementGroup.storeKeyFor(groupId);
        groupRec = store.materializeRecord(groupSKey);
      } else {
        groupRec = null;
      }
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
    if(status == SC.Record.READY_CLEAN) {
      this.getLayoutGroupRecords();
    }
  }.observes('*layoutIncomeStatementGroup.status'),

  statusDidChange: function() {
    console.log('status changed!!!!')
  }.observes('status'),

};
