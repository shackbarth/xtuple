// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================
/*globals SC */

/**
  Registers the child record and set the parent on the child's foreign key
  as soon as it is pushed on to the array.
*/
SC.ChildArray.prototype.pushObject = function(obj) {
  var parent = this.get('record'),
      store = parent.get('store'),
      psk = parent.get('storeKey'),
      csk = obj.get('storeKey'),
      propertyName = this.get('propertyName'),
      path;
  
  // do what we're here for
  this.insertAt(this.get('length'), obj);
  
  // register child
  parent.isParentRecord = true;
  store.registerChildToParent(psk, csk, path);
  path = store.parentRecords[psk][csk];
  parent.recordDidChange(path);
  
  // set the parent on the child's foreign key
  if (parent[propertyName] && parent[propertyName].inverse) {
    var key = parent[propertyName].inverse;
       // value = obj[key].isNested ? parent : parent.get('id');
    obj.set(key, parent);
  }

  return obj;
}
