// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('mixins/logging');

/** @class
*/
XT.Store = SC.Store.extend(XT.Logging,
  /** @scope XT.Store.prototype */ {

  //............................................
  // METHODS
  //

  /**
    Dispatch a call to the node datasource to process a function.

    @param {XT.Dispatch} dispatch The dispatch object to send.
    @returns {SC.Store} receiver
  */
  dispatch: function(dispatch) {
    if (!dispatch) throw new Error("dispatch() requires a dispatch");

    var store = this;
    var source;

    // if we're in a nested store we have to walk back up to be
    // able to send the dispatch
    // TODO: should this wait until we're ready to commit?
    while (!(source = store._getDataSource())) store = store.get('parentStore');
    if (source && source.dispatch) {
      source.dispatch.call(source, this, dispatch);
    } else { throw new Error("XT.store.dispatch() source or source.dispatch not available"); }

    return this;
  },
  
  /**
    Called by a data source when a dispatch result has been returned.

    @param {XT.Dispatch} dispatch The dispatch originally called.
    @param {Hash} dataHash The result hash.
  */
  dataSourceDidDispatch: function(dispatch, result) {
    var target = dispatch.get('target'),
        action = dispatch.get('action');
    if (action) action.call(target, null, result);
  },

  /**
    Called by your data source if it encountered an error dispatching a 
    function call. The dispatch will pass the error back throug the
    original callback action if one has been defined.

    @param {XT.Dispatch} dispatch The dispatch that generated the error.
    @param {SC.Error} [error] SC.Error instance to associate with the dispatch.
  */
  dataSourceDidErrorDispatch: function(dispatch, error) {
    var errors = this.dispatchErrors,
        target = dispatch.get('target'),
        action = dispatch.get('action');

    // Add the error to the array of dispatch errors (for lookup later on if
    // necessary).
    if (error && error.isError) {
      if (!errors) errors = this.dispatchErrors = {};
      errors[SC.guidFor(dispatch)] = error;
    }
    if (action) action.call(target, error, null);
  },
  
  // ..........................................................
  // REIMPLEMENTED METHODS
  //
  // The methods in this section re-implement standard SC.Store methods with modifictions.
  
  /**
    Reimplemented from `SC.Store`.

    After creating a record create a temporary id, then fetch one asynchronously from 
    the data source.
  */
  createRecord: function(recordType, dataHash, id) {
    var primaryKey = recordType.prototype.primaryKey,
        args = SC.A(arguments);

    // Create a temporary id (negative of store key) if none passed
    if (primaryKey === 'guid' && SC.none(dataHash.guid)) {
      var storeKey = SC.Store.generateStoreKey(),
          id = storeKey * -1;
      SC.Store.replaceRecordTypeFor(storeKey, recordType);
      SC.Store.replaceIdFor(storeKey, id);
      dataHash.guid = id;
      args[1] = dataHash;
    }

    // Do the standard thing
    var ret = arguments.callee.base.apply(this, args);
    
    // If primary key is guid and id is temporary, fetch a real one asynchronously
    if (primaryKey === 'guid' && ret.get('id') < 0) {
      XT.Record.fetchId.call(ret);
    }

    return ret
  },
  
  /**
    Reimplemented from `SC.Store`.

    Don't destroy children automatically.
    Remove dataHash immediately if READY_NEW.
  */
  destroyRecord: function(recordType, id, storeKey) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), changelog, K = SC.Record;

    // handle status - ignore if destroying or destroyed
    if ((status === K.BUSY_DESTROYING) || (status & K.DESTROYED)) {
      return this; // nothing to do

    // error out if empty
    } else if (status === K.EMPTY) {
      throw K.NOT_FOUND_ERROR ;

    // error out if busy
    } else if (status & K.BUSY) {
      throw K.BUSY_ERROR ;

    // if new status, destroy but leave in clean state
    } else if (status === K.READY_NEW) {
      status = K.DESTROYED_CLEAN ;
      this.removeDataHash(storeKey, status);

    // otherwise, destroy in dirty state
    } else status = K.DESTROYED_DIRTY ;

    // remove the data hash, set new status
    this.writeStatus(storeKey, status);
    this.dataHashDidChange(storeKey);

    // add/remove change log
    changelog = this.changelog;
    if (!changelog) changelog = this.changelog = SC.Set.create();

    ((status & K.DIRTY) ? changelog.add(storeKey) : changelog.remove(storeKey));
    this.changelog=changelog;

    // if commit records is enabled
    if(this.get('commitRecordsAutomatically')){
      this.invokeLast(this.commitRecords);
    }

    return this ;
  },

  /**
    Reimplemented from `SC.Store`.

    Don't notify status here.
  */
  registerChildToParent: function(parentStoreKey, childStoreKey, path) {
    var prs, crs, oldPk, oldChildren, pkRef, rec;

    // Check the child to see if it has a parent.
    crs = this.childRecords || {};
    prs = this.parentRecords || {};
    oldPk = crs[childStoreKey];

    // Determine what to do.
    if (oldPk && oldPk === parentStoreKey) return;

    if (oldPk){
      oldChildren = prs[oldPk];
      delete oldChildren[childStoreKey];
    }

    pkRef = prs[parentStoreKey] || {};
    pkRef[childStoreKey] = path || true;
    prs[parentStoreKey] = pkRef;
    crs[childStoreKey] = parentStoreKey;
    this.childRecords = crs;
    this.parentRecords = prs;
  },

  /**
    Reimplemented from `SC.Store`.

    Removes parents updating children with parent status when we don't need
    or want that behavior.
  */
  writeDataHash: function(storeKey, hash, status) {
    // Update dataHashes and optionally status.
    if (hash) this.dataHashes[storeKey] = hash;
    if (status) this.statuses[storeKey] = status;

    // Also note that this hash is now editable.
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1; // Use number for dense array support.

    return this;
  },
  
  /**
    Reimplemented from `SC.Store`.

    Don't notify children here.
  */
  dataHashDidChange: function(storeKeys, rev, statusOnly, key) {
    // Update the revision for `storeKey`.  Use `generateStoreKey()` because
    // that guarantees a universally (to this store hierarchy anyway) unique
    // key value.
    if (!rev) rev = SC.Store.generateStoreKey();
    var isArray, len, idx, storeKey;

    isArray = SC.typeOf(storeKeys) === SC.T_ARRAY;
    if (isArray) {
      len = storeKeys.length;
    } else {
      len = 1;
      storeKey = storeKeys;
    }

    var that = this;
    for (idx=0; idx<len; ++idx) {
      if (isArray) storeKey = storeKeys[idx];
      this.revisions[storeKey] = rev;
      this._notifyRecordPropertyChange(storeKey, statusOnly, key);
    }

    return this;
  },
  
  /**
    Reimplemented from `SC.Store`.

    Change status of child records to busy.
  */
  commitRecords: function(recordTypes, ids, storeKeys, params, callbacks) {
    var source    = this._getDataSource(),
        isArray   = SC.typeOf(recordTypes) === SC.T_ARRAY,
        hasCallbackArray = SC.typeOf(callbacks) === SC.T_ARRAY,
        retCreate= [], retUpdate= [], retDestroy = [],
        rev       = SC.Store.generateStoreKey(),
        K         = SC.Record,
        recordType, idx, storeKey, status, key, ret, len, callback;

    // If no params are passed, look up storeKeys in the changelog property.
    // Remove any committed records from changelog property.

    if(!recordTypes && !ids && !storeKeys){
      storeKeys = this.changelog;
    }

    len = storeKeys ? storeKeys.get('length') : (ids ? ids.get('length') : 0);

    for(idx=0;idx<len;idx++) {

      // collect store key
      if (storeKeys) {
        storeKey = storeKeys[idx];
      } else {
        if (isArray) recordType = recordTypes[idx] || SC.Record;
        else recordType = recordTypes;
        storeKey = recordType.storeKeyFor(ids[idx]);
      }

      //collect the callback
      callback = hasCallbackArray ? callbacks[idx] : callbacks;

      // collect status and process
      status = this.readStatus(storeKey);

      if ((status == K.EMPTY) || (status == K.ERROR)) {
        throw K.NOT_FOUND_ERROR ;
      }
      else {
        if (status==K.READY_NEW) {
          this.writeStatus(storeKey, K.BUSY_CREATING);
          this.dataHashDidChange(storeKey, rev, true);
          retCreate.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.READY_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_COMMITTING);
          this.dataHashDidChange(storeKey, rev, true);
          retUpdate.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.DESTROYED_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_DESTROYING);
          this.dataHashDidChange(storeKey, rev, true);
          retDestroy.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.DESTROYED_CLEAN) {
          this.dataHashDidChange(storeKey, rev, true);
        }
        // ignore K.READY_CLEAN, K.BUSY_LOADING, K.BUSY_CREATING, K.BUSY_COMMITTING,
        // K.BUSY_REFRESH_CLEAN, K_BUSY_REFRESH_DIRTY, KBUSY_DESTROYING

        // update status of modified children
        var that = this;
        this._propagateToChildren(storeKey, function(storeKey) {
          var status = that.readStatus(storeKey),
              rev = SC.Store.generateStoreKey();
          if (status==K.READY_NEW) {
            that.writeStatus(storeKey, K.BUSY_CREATING);
            that.dataHashDidChange(storeKey, rev, true);
          } else if (status==K.READY_DIRTY) {
            that.writeStatus(storeKey, K.BUSY_COMMITTING);
            that.dataHashDidChange(storeKey, rev, true);
          } else if (status==K.DESTROYED_DIRTY) {
            that.writeStatus(storeKey, K.BUSY_DESTROYING);
            that.dataHashDidChange(storeKey, rev, true);
          } else if (status==K.DESTROYED_CLEAN) {
            that.dataHashDidChange(storeKey, rev, true);
          }
        });
      }
    }

    // now commit storekeys to dataSource
    if (source && (len>0 || params)) {
      ret = source.commitRecords.call(source, this, retCreate, retUpdate, retDestroy, params);
    }

    //remove all committed changes from changelog
    if (ret && !recordTypes && !ids) {
      if (storeKeys === this.changelog) {
        this.changelog = null;
      }
      else {
        this.changelog.removeEach(storeKeys);
      }
    }
    return ret ;
  },

  /**
    Reimplemented from `SC.Store`.

    Update children only when appropriate with the proper status.
  */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    var status = this.readStatus(storeKey), K = SC.Record, statusOnly;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }

    // otherwise, determine proper state transition
    if(status===K.BUSY_DESTROYING) {
      throw K.BAD_STATE_ERROR ;
    } else status = K.READY_CLEAN ;

    this.writeStatus(storeKey, status) ;
    if (dataHash) this.writeDataHash(storeKey, dataHash, status) ;
    if (newId) SC.Store.replaceIdFor(storeKey, newId);

    statusOnly = dataHash || newId ? false : true;
    this.dataHashDidChange(storeKey, null, statusOnly);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);

    // update affected children
    if (statusOnly) {
      var that = this;
      this._propagateToChildren(storeKey, function(storeKey) {
        var status = that.peekStatus(storeKey);
        if (status & SC.Record.BUSY) {
          var newStatus = status != K.BUSY_DESTROYING ? K.READY_CLEAN : K.DESTROYED_CLEAN;
          that.writeStatus(storeKey, newStatus);
          that.dataHashDidChange(storeKey, null, true);
        }
      });
    }

    //update callbacks
    this._retreiveCallbackForStoreKey(storeKey);

    return this ;
  },

  /**
    Reimplemented from `SC.Store`.

    Change status of child records to destroyed, and remove duplicate notice
    on parent.
  */
  dataSourceDidDestroy: function(storeKey) {
    var status = this.readStatus(storeKey), K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }
    // otherwise, determine proper state transition
    else{
      status = K.DESTROYED_CLEAN ;
    }
    this.removeDataHash(storeKey, status) ;
    this.dataHashDidChange(storeKey);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);

    // update affected children
    var that = this;
    this._propagateToChildren(storeKey, function(storeKey) {
      var status = that.peekStatus(storeKey);
      if (status & SC.Record.BUSY) {
        var newStatus = K.DESTROYED_CLEAN;
        that.writeStatus(storeKey, newStatus);
        that.removeDataHash(storeKey, newStatus) ;
        that.dataHashDidChange(storeKey, null, true);
      }
    });

    this._retreiveCallbackForStoreKey(storeKey);

    return this ;
  },

  /**
    Reimplemented from `SC.Store`.

    Change status of child records to error, and remove duplicate notice on
    parent.
  */
  dataSourceDidError: function(storeKey, error) {
    var status = this.readStatus(storeKey), errors = this.recordErrors, K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) { throw K.BAD_STATE_ERROR; }

    // otherwise, determine proper state transition
    else status = K.ERROR ;

    // Add the error to the array of record errors (for lookup later on if
    // necessary).
    if (error && error.isError) {
      if (!errors) errors = this.recordErrors = [];
      errors[storeKey] = error;
    }

    this.writeStatus(storeKey, status) ;
    this.dataHashDidChange(storeKey, null, true);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);

    // update affected children
    var that = this;
    this._propagateToChildren(storeKey, function(storeKey) {
      var status = that.peekStatus(storeKey);
      if (status & SC.Record.BUSY) {
        var newStatus = K.ERROR;
        that.writeStatus(storeKey, newStatus);
        that.dataHashDidChange(storeKey, null, true);
      }
    });

    // update callbacks
    this._retreiveCallbackForStoreKey(storeKey);
    return this ;
  },

  // ..........................................................
  // STORE CHAINING
  //

  /**
    Returns a new nested store instance that can be used to buffer changes
    until you are ready to commit them.  When you are ready to commit your
    changes, call `commitChanges()` or `destroyChanges()` and then `destroy()`
    when you are finished with the chained store altogether.

        store = MyApp.store.chain();
        .. edit edit edit
        store.commitChanges().destroy();

    @param {Hash} attrs optional attributes to set on new store
    @param {Class} newStoreClass optional the class of the newly-created nested store (defaults to SC.NestedStore)
    @returns {SC.NestedStore} new nested store chained to receiver
  */
  chain: function(attrs) {
    if (!attrs) attrs = {};
    attrs.parentStore = this;

    var newStoreClass = XT.NestedStore;

    // Replicate parent records references
    attrs.childRecords = this.childRecords ? SC.clone(this.childRecords) : {};
    attrs.parentRecords = this.parentRecords ? SC.clone(this.parentRecords) : {};

    var ret    = newStoreClass.create(attrs),
        nested = this.nestedStores;

    if (!nested) nested = this.nestedStores = [];
    nested.push(ret);
    return ret ;
  }

});
