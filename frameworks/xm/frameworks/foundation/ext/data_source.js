// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('ext/request');

/** @class XM.DataSource

  To add a new table to XM.DataSource, add the
  appropriate client<->server mapping of table and field names to
  ..../server/datasource and sc-gen the corresponding model.

  @extends SC.DataSource
*/
XM.DataSource = SC.DataSource.create(XM.Logging,
/** @scope XM.DataSource.prototype */ {

  getSession: function() {
    XM.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' })
      .notify(this, 'didGetSession').json()
      .send({ 
        requestType: 'requestSession',
        userName: 'admin',
        password: 'admin'
      });
  },

  ready: function(callback, context) {
    var args = Array.prototype.slice.call(arguments),
        args = args.length > 2 ? args.slice(2) : [], 
        context = context ? context : null, cbs;
    if(this.get('isReady')) return callback.apply(context, args);
    if(!this._onreadycallbacks) cbs = this._onreadycallbacks = [];
    else cbs = this._onreadycallbacks;
    cbs.push({ callback: callback, context: context, args: args });
  },

  isReadyDidChange: function() {
    if(!this.get('isReady')) return;
    var cbs = this._onreadycallbacks || [],
        i = 0, cb;
    for(; i<cbs.length; ++i) {
      cb = cbs[i];
      if(cb.callback && SC.typeOf(cb.callback) === SC.T_FUNCTION)
        cb.callback.apply(cb.context, cb.args);
    }

    if(SC.isNode) process.emit('sessionReady');
    
  }.observes('isReady'),

  didGetSession: function(response) {
    if(SC.ok(response)) {
      var body = response.get('body');
      this.set('session', body);
    } else { throw "Could not acquire session" }
    this.set('isReady', YES);
  },

  serverIsAvailable: NO,

  URL: SC.isNode? 'http://localhost:4020/datasource/data' : '/datasource/data',
  
  debug: NO,
  
  // ..........................................................
  // FUNCTION SUPPORT
  //

  dispatch: function(store, dispatch) {

    var payload = {};

    payload.requestType = 'dispatch';
    payload.className = dispatch.get('className');
    payload.functionName = dispatch.get('functionName');
    payload.parameters = dispatch.get('parameters');
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    XM.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didDispatchData', store, dispatch)
      .send(payload);

    return YES;
  },

  didDispatchData: function(response, store, dispatch) {
    var error, dataHash;
    if(SC.ok(response)) {
      if(response.get("body").error) {
        error = SC.Error.create({ 
          code: 'Error',
          label: 'Datasource Error',
          message: response.get("body").message
        });
            
        store.dataSourceDidErrorDispatch(dispatch, error);
      } else {
        result = JSON.parse(response.get("body").rows[0].dispatch);
    
        store.dataSourceDidDispatch(dispatch, result);
        
        return YES;
      }
    } 
    return NO;
  },
  
  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {
    var payload = {}, qp = query.get('parameters'), params = {};
    
    // convert any any regular expressions to text
    for(var prop in qp) {
      params[prop] = qp[prop].source === undefined ? qp[prop] : qp[prop].source;
    }

    payload.requestType = 'fetch';
    payload.query = {};
    payload.query.recordType = query.get('recordType').prototype.className;
    payload.query.conditions = query.get('conditions');
    payload.query.parameters = params;
    payload.query.orderBy = query.get('orderBy');

    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    XM.Request.postUrl(this.URL)
      .header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchData', store, query)
      .send(payload);

    return YES;
  },

  didFetchData: function(response, store, query) {
    if(SC.ok(response)) {
      // TODO: Handle specific db error codes
      if(response.get("body").error ) {
        var error = SC.Error.create({ 
          code: 'Error',
          label: 'Datasource Error',
          message: response.get("body").message
        });
        
        store.dataSourceDidErrorQuery(query, error);
      } else {
        var results = JSON.parse(response.get("body").rows[0].fetch),
        recordType = query.get('recordType');
        
        results.forEach(function(dataHash) {
          store.pushRetrieve(recordType, dataHash.guid, dataHash);
        })
        store.dataSourceDidFetchQuery(query);
      }
    } 
  },

  // ..........................................................
  // RECORD SUPPORT
  //

  retrieveRecord: function(store, storeKey, id) {

    var recordType = store.recordTypeFor(storeKey).prototype.className, 
        payload = {};

    id = id ? id : store.materializeRecord(storeKey).get('id');

    payload.requestType = 'retrieveRecord';
    payload.recordType = recordType;
    payload.id = id;
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    XM.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didRetrieveData', store, storeKey)
      .send(payload);

    return YES;
  },

  didRetrieveData: function(response, store, storeKey) {
    var error, dataHash;

    if(SC.ok(response)) {
      if(response.get("body").error) {
        error = SC.Error.create({ 
          code: 'Error',
          label: 'Datasource Error',
          message: response.get("body").message
        });
            
        store.dataSourceDidError(storeKey, error);
      } else {
        dataHash = JSON.parse(response.get("body").rows[0].retrieve_record);
        
        store.dataSourceDidComplete(storeKey, dataHash);
        
        return YES
      }
    } 
    return NO;
  },
  
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var storeKeys = createStoreKeys.concat(updateStoreKeys).concat(destroyStoreKeys),
        ret = YES;
    
    for(var i = 0; i < storeKeys.get('length'); i++) {
      if(!this.commitRecord(store, storeKeys[i])) { ret = NO; }
    }

    return ret;
  },
  
  commitRecord: function(store, storeKey) {

    var recordType = store.recordTypeFor(storeKey).prototype.className, 
        payload = {},
        record = store.materializeRecord(storeKey);

    payload.requestType = 'commitRecord';
    payload.recordType = recordType;
    payload.dataHash = record.get('attributes');
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    XM.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didCommitData', store, storeKey)
      .send(payload);

    return YES;
  },

  didCommitData: function(response, store, storeKey) {
    var error, dataHash;
    
    if (SC.ok(response)) {
      // TODO: Handle specific db error codes
      if(response.get("body").error) {
        error = SC.Error.create({ 
          code: 'Error',
          label: 'Datasource Error',
          message: response.get("body").message
        });
        
        store.dataSourceDidError(storeKey, error);
      } else {
        store.peekStatus(storeKey) !== SC.Record.BUSY_DESTROYING ?
        store.dataSourceDidComplete(storeKey) :
        store.dataSourceDidDestroy(storeKey);
      }
    }
    
    return YES;
  }

});

XM.DataSource.start = function start() {
  var ds = XM.DataSource;
  ds.log("Starting up");
  ds.store = XM.Store = XM.Store.create().from("XM.DataSource");
  ds.pingServer();
  return YES;
};
