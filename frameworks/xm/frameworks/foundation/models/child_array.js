// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
/*globals SC */

/**
  Registers the child record as soon as it is pushed on to the array.
*/
SC.ChildArray.prototype.pushObject = function(obj) {
  this.insertAt(this.get('length'), obj);
  
  var parent = this.get('record'),
      store = parent.get('store'),
      psk = parent.get('storeKey'),
      csk = obj.get('storeKey'),
      path;
  parent.isParentRecord = true;
  store.registerChildToParent(psk, csk, path);
  path = store.parentRecords[psk][csk];
  parent.recordDidChange(path);

  return obj;
}
