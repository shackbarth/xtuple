// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_user_account_info');

/**
  @class

  @extends XT.Record
*/
XM.UserAccountInfo = XT.Record.extend(XM._UserAccountInfo,
  /** @scope XM.UserAccountInfo.prototype */ {

  primaryKey: 'username'

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});

/**
  Fetch a UserAccountInfo record for the current user and set
  its attributes on a passed record and property;
  
  @param {XT.Record} record to set property on
  @param {String} property to set
  @returns Receiver
*/
XM.UserAccountInfo.setCurrentUser = function(record, property) {
  var store = record.get('store'),
      userName = store.get('dataSource').session.userName,
      res = store.find('XM.UserAccountInfo', userName);
  res.addObserver('status', res, function observer() {
    if (res.get('status') === SC.Record.READY_CLEAN) {
      res.removeObserver('status', res, observer);
      record.set(property, res.get('attributes'));
    }
  });
  return this;
}

