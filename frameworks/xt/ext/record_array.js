// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals SC */

/**
  Reimplemented from `SC.RecordArray`.

  Notify status change.
*/
SC.RecordArray.prototype.objectAt = function(idx) {

  this.flush(); // cleanup pending if needed

  var recs      = this._scra_records,
      storeKeys = this.get('storeKeys'),
      store     = this.get('store'),
      storeKey, ret ;

  if (!storeKeys || !store) return undefined; // nothing to do
  if (recs && (ret=recs[idx])) return ret ; // cached

  // not in cache, materialize
  if (!recs) this._scra_records = recs = [] ; // create cache
  storeKey = storeKeys.objectAt(idx);

  if (storeKey) {
    // if record is not loaded already, then ask the data source to
    // retrieve it
    if (store.peekStatus(storeKey) === SC.Record.EMPTY) {
      store.retrieveRecord(null, null, storeKey);
    }
    recs[idx] = ret = store.materializeRecord(storeKey);
    if (ret != null) {
      ret.notifyPropertyChange('status');
    }
  }
  return ret ;
}

  