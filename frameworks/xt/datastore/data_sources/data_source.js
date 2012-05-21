// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('ext/request');

/** @class
*/
XT.DataSource = SC.Object.extend(XT.Logging, 
  /** @scope XT.DataSource.prototype */ {

  //............................................
  // PROPERTIES
  //

  /**
    @NodeHackHere

    @type String
  */
  URL: SC.isNode ? 'http://localhost:4020/datasource/data' : '/datasource/data',

  /**
    Logging for this object?
  */
  logLocal: false,

  //............................................
  // METHODS
  //

  /**
    To ensure that requests won't be sent until after a session is acquired,
    callbacks that issue the request are registered until the session is
    available. If no session exists they are queued. When a session becomes
    available the queue is flushed and any new requests are fired immediately.

    @param {Function} callback The method to fire when the session is available.
    @param {Object} [context] The context in which to execute the callback.
    @param {...} [arguments] Any additional arguments are supplied to the callback method.
  */
  ready: function(callback, context) {
    var args = SC.A(arguments);
    var callbacks;

    args = args.length > 2 ? args.slice(2) : [];
    context = context ? context : null;

    if (this.get('isReady')) {
      this.log("ready => flushing request immediately");
      callback.apply(context, args);
      return true;
    }

    this.log("ready => queueing a request (%@)".fmt(callback.name || 'anonymous'));

    if (!this._onreadycallbacks) callbacks = this._onreadycallbacks = [];
    else callbacks = this._onreadycallbacks;

    callbacks.push({ callback: callback, context: context, args: args });
    return true;
  },

  /**
    Dispatch a function request to the node datasource.

    @param {SC.Store} store Reference to store for the dispatch.
    @param {XT.Dispatch} dispatch The dispatch object to send to the node datasource.
  */
  dispatch: function(store, dispatch) {
    return this.ready(this._dispatch, this, store, dispatch);
  },

  /**
    Fetch a collection of records from the node datasource based on `query`
    parameters and conditions.

    @param {SC.Store} store The store associated with the query.
    @param {SC.Query} query The query object to pass to the node datasource.
  */
  fetch: function(store, query) {
    return this.ready(this._fetch, this, store, query);
  },
  
  /**
    Called by the store whenever it needs to load a specific set of store
    keys.  

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys
    @param {Array} ids - optional
    @returns {Boolean} true if handled, false otherwise
  */
  retrieveRecords: function(store, storeKeys, ids) {
    return this._handleEach(store, storeKeys, this.retrieveRecord, ids);
  },

  /**
    Retrieve an individual record from the node datasource.

    @param {SC.Store} store The store to be passed to the callback.
    @param {Number} storeKey The integer storeKey value for the record.
    @param {Number} [id] The numeric id for the record to be retrieved.
  */
  retrieveRecord: function(store, storeKey, id) {
    return this.ready(this._retrieveRecord, this, store, storeKey, id);
  },

  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var storeKeys = createStoreKeys.concat(updateStoreKeys).concat(destroyStoreKeys),
        ret = true;

    for (var idx=0, len=storeKeys.length; idx<len; ++idx) {
      if (!this.commitRecord(store, storeKeys[idx])) ret = false;
    }

    return ret;
  },

  /**
    Commit a record to the node datasource.

    @param {SC.Store} store The store to commit from.
    @param {Number} storeKey The storeKey for the record to commit.
  */
  commitRecord: function(store, storeKey) {
    return this.ready(this._commitRecord, this, store, storeKey);
  },

  //............................................
  // CALLBACKS
  //

  /**
    Callback receives resposne for a dispatch request.

    @param {SC.Response} response The response from the request.
    @param {SC.Store} store The store as passed in from the dispatcher.
    @param {XT.Dispatch} dispatch The original dispatch object.
  */
  didDispatch: function(response, store, dispatch) {
    if (SC.ok(response)) {
      if (response.error) {
        var error = SC.Error.create({
          code: 'xt1014',
          label: '_datasourceError'.loc(),
          message: '_dispatchError'.loc() + ': ' + response.get("body").reason
        });
        store.dataSourceDidErrorDispatch(dispatch, error);
      } else {
        var result = JSON.parse(response.get("body").rows[0].dispatch);
        store.dataSourceDidDispatch(dispatch, result);
      }
    }
  },

  /**
    Callback receives response for a fetch request.

    @param {SC.Response} response The response from the request.
    @param {SC.Store} store The store as passed from the fetch request.
    @param {SC.Query} query The original query object.
  */
  didFetch: function(response, store, query) {
    console.log('didFetch', query);
    if (SC.ok(response)) {
      if (response.error ) {
        var error = SC.Error.create({
          code: 'xt1012',
          label: '_datasourceError'.loc(),
          message: '_fetchError'.loc() + ': ' + response.get("body").reason
        });
        store.dataSourceDidErrorQuery(query, error);
      } else {
        var results = JSON.parse(response.get("body").rows[0].fetch),
            recordType = query.get('recordType');

        var storeKeys = results.map(function(dataHash) {
          return store.pushRetrieve(recordType, dataHash.guid, dataHash);
        });
        if (query.get('isRemote')) {
          store.loadQueryResults(query, storeKeys);
        } else {
          store.dataSourceDidFetchQuery(query);
        }
      }
    }
  },

  /**
    Callback receives response for retrieveRecord request.

    @param {SC.Response} response The response from the request.
    @param {SC.Store} store The store as passed from the retrieveRecord
      request.
    @param {Number} storeKey The storeKey for the record to populate.
  */
  didRetrieveRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      if (response.error) {
        var error = SC.Error.create({
          code: 'xt1011',
          label: '_datasourceError'.loc(),
          message: '_retrieveError'.loc() + ': ' + response.get("body").reason
        });
        store.dataSourceDidError(storeKey, error);
      } else {
        var dataHash = JSON.parse(response.get("body").rows[0].retrieve_record);
        store.dataSourceDidComplete(storeKey, dataHash);
      }
    }
  },

  /**
    Callback receives response for commitRecord request.

    @param {SC.Response} response The response from the request.
    @param {SC.Store} store The store as passed by the commitRecord request.
    @param {Number} storeKey The storeKey for the record that was committed.
  */
  didCommitRecord: function(response, store, storeKey) {
    if (SC.ok(response)) {
      if (response.error) {
        var error = SC.Error.create({
          code: 'xt1013',
          label: '_datasourceError'.loc(),
          message: '_commitError'.loc() + ': ' + response.get("body").reason
        });
        error.set('message', error.get('message') + ': ' + response.get("body").context);
        store.dataSourceDidError(storeKey, error);
      } else {
        if (store.peekStatus(storeKey) !== SC.Record.BUSY_DESTROYING) {
          store.dataSourceDidComplete(storeKey);
        } else {
          store.dataSourceDidDestroy(storeKey);
        }
      }
    }
  },

  //............................................
  // PRIVATE METHODS
  //
  
  /** @private
    invokes the named action for each store key.  returns proper value
  */
  _handleEach: function(store, storeKeys, action, ids, params) {
    var len = storeKeys.length, idx, ret, cur, idOrParams;

    for(idx=0;idx<len;idx++) {
      idOrParams = ids ? ids[idx] : params;

      cur = action.call(this, store, storeKeys[idx], idOrParams);
      if (ret === undefined) {
        ret = cur ;
      } else if (ret === true) {
        ret = (cur === true) ? true : SC.MIXED_STATE ;
      } else if (ret === false) {
        ret = (cur === false) ? false : SC.MIXED_STATE ;
      }
    }
    return !SC.none(ret) ? ret : null ;
  },

  /** @private */
  _dispatch: function _dispatch(store, dispatch) {
    var payload = {
          requestType: 'dispatch',
          className: dispatch.get('className'),
          functionName: dispatch.get('functionName'),
          parameters: dispatch.get('parameters')
        };

    this.log("dispatch => payload: ", payload);

    XT.Request
      .issue('function/dispatch')
      .notify(this, 'didDispatch', store, dispatch)
      .json().send(payload);
    // XT.Request
    //   .postUrl(this.URL)
    //   .header({ 'Accept': 'application/json' }).json()
    //   .notify(this, 'didDispatch', store, dispatch)
    //   .send(payload);
  },

  /** @private */
  _fetch: function _fetch(store, query) {
    var payload = {}, qp = query.get('parameters'),
        conditions = query.get('conditions'),
        orderBy = query.get('orderBy'),
        language = query.get('queryLanguage'),
        recordType = query.get('recordType'),
        list, conds = [], params = {};

    // massage conditions so they are compatible with the data source
    list = query.tokenizeString(conditions, language);
    for (var idx=0, len= list.length; idx<len; ++idx) {
      var tokenValue;
      switch (list[idx].tokenType) {
        case "PROPERTY":
          var value = list[idx].tokenValue,
              proto = recordType.prototype;
          // format nested records to array query format
          if (proto[value] && proto[value].isChildAttribute && proto[value].isNested) {
            tokenValue = '("' + value + '").guid';
          } else tokenValue = value === "id" ? '"guid"' : '"' + value + '"';
          break;
        case "YES":
          tokenValue = "true";
          break;
        case "NO":
          tokenValue = "false";
          break;
        case "BEGINS_WITH":
          tokenValue = '~^';
          break;
        case "ENDS_WITH":
          tokenValue = '~?';
          break;
        case "CONTAINS":
        case "MATCHES":
          tokenValue = '~';
          break;
        case "ANY":
          tokenValue = '<@';
          break;
        case "PARAMETER":
          tokenValue =  '{' + list[idx].tokenValue + '}';
          break;
        case "%@":
          tokenValue = list[idx].tokenType;
          break;
        default:
          tokenValue = list[idx].tokenValue;
      }
      conds.push(tokenValue);
    }

    // massage 'orderBy' as well
    if (orderBy) {
      // split order by on comma into array
      list = orderBy.split(',');
      for (var i = 0; i < list.get('length'); i++) {
        // strip leading whitespace and separate potential DESC and ASC qualifiers
        var str = list.objectAt(i).replace(/^\s+|\s+$/g,""),
            sub = str.split(' ');
        // quote the property name, then put it all back together
        sub.replace(0, 1, ['"' + sub.firstObject() + '"']);
        list.replace(i, 1, [sub.join(' ')]);
      }
      orderBy = list.join(',');
    }
    
    // helper function to convert parameters to data source friendly formats
    var format = function(value) {
      // format date if applicable
      if (SC.kindOf(value, XT.DateTime)) {
        return value.toFormattedString('%Y-%m-%d');
      // format record if applicable
      } else if (SC.kindOf(value, SC.Record)) {
        return value.get('id');
      }
      // return regex source if regex
      return value.source === undefined ? value : value.source;
    };

    // massage parameters so they are compatible with the data source
    if (qp instanceof Array) {
      for (var j=0, l=qp.length; j<l; ++j) qp[j] = format(qp[j]);
    } else {
      for (var prop in qp) params[prop] = format(qp[prop]);
    }
    payload.requestType = 'fetch';
    payload.query = {
      recordType: query.get('recordType').prototype.className,
      conditions: conds.join(' '),
      parameters: params,
      orderBy: orderBy,
      rowLimit: query.get('rowLimit'),
      rowOffset: query.get('rowOffset')
    };

    this.log("fetch => payload: ", payload);

    XT.Request
      .issue('function/fetch')
      .notify(this, 'didFetch', store, query)
      .json().send(payload);
    // XT.Request
    //   .postUrl(this.URL)
    //   .header({'Accept': 'application/json'}).json()
    //   .notify(this, 'didFetch', store, query)
    //   .send(payload);
  },

  /** @private */
  _retrieveRecord: function _retrieveRecord(store, storeKey, id) {
    var recordType = store.recordTypeFor(storeKey).prototype.className,
        payload = {};
    id = id ? id : store.materializeRecord(storeKey).get('id');
    payload.requestType = 'retrieveRecord';
    payload.recordType = recordType;
    payload.id = id;
    this.log("retrieveRecord => payload: ", payload);

    XT.Request
      .issue('function/retrieveRecord')
      .notify(this, 'didRetrieveRecord', store, storeKey)
      .json().send(payload);

    // XT.Request
    //   .postUrl(this.URL)
    //   .header({ 'Accept': 'application/json' }).json()
    //   .notify(this, 'didRetrieveRecord', store, storeKey)
    //   .send(payload);
  },

  /** @private */
  _commitRecord: function _commitRecord(store, storeKey) {
    var recordType = store.recordTypeFor(storeKey).prototype.className,
        payload = {},
        record = store.materializeRecord(storeKey);
    payload.requestType = 'commitRecord';
    payload.recordType = recordType;
    payload.dataHash = record.get('changeSet');
    this.log("commitRecord => payload: ", payload);

    XT.Request
      .issue('function/commitRecord')
      .notify(this, 'didCommitRecord', store, storeKey)
      .json().send(payload);

    // XT.Request
    //   .postUrl(this.URL)
    //   .header({ 'Accept': 'application/json' }).json()
    //   .notify(this, 'didCommitRecord', store, storeKey)
    //   .send(payload);
  },

  //............................................
  // OBSERVERS
  //

  /** @private
    When a session is acquired by the application the `isReady` flag becomes
    `true`. Any pending requests are then flushed from the queue.

    @NodeHackHere
  */
  isReadyDidChange: function() {
    var ready = this.get('isReady');
    this.log("isReadyDidChange => datasource is %@%@".fmt(ready ? 'ready' : 'not ready', ready ? ', flushing queue' : ''));
    if (!ready) return;

    var callbacks = this._onreadycallbacks || [],
        callback;

    for (var idx=0, len=callbacks.length; idx<len; ++idx) {
      callback = callbacks[idx];
      if (callback.callback && SC.typeOf(callback.callback) === SC.T_FUNCTION) {
        callback.callback.apply(callback.context, callback.args);
      }
    }

    if (SC.isNode) process.emit('sessionReady');
  }.observes('isReady')

});
