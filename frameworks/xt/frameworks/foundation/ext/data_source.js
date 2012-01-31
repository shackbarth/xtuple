// ==========================================================================
// Project:   XT.DataSource
// Copyright: Â©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class XT.DataSource

  To add a new table to XT.DataSource, add the
  appropriate client<->server mapping of table and field names to
  ..../server/datasource and sc-gen the corresponding model.

  @extends SC.DataSource
*/

XT.DataSource = SC.DataSource.create(XT.Logging,
/** @scope XT.DataSource.prototype */ {

  serverIsAvailable: NO,

  serverIsAvailableTooltip: function() {
    var iv = this.get('serverIsAvailable');
    if(iv) return '_serverAvailable'.loc();
    else return '_serverUnavailable'.loc();
  }.property('serverIsAvailable'),

  pingServer: function() {
    SC.Request.postUrl(this.URL)
      .header({'Accept': 'application/json'})
      .notify(this, "pingResponse").json()
      .timeoutAfter(1000)
      .send({ name: "XT.PingFunctor" });
  },

  pingResponse: function(response) {
    var r = response;
    if(r.timedOut) {
      this.warn("Ping request to server timedout!");
      this.set("serverIsAvailable", NO);
    } else if(r.status !== 200) { this.set("serverIsAvailable", NO); } 
    else { this.set("serverIsAvailable", YES); }
  },
  
  URL: '/datasource/data',
  
  debug: YES,
  
  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {
    var payload = new Object;
    
    payload.requestType = 'fetch';
    payload.query = new Object;
    payload.query.recordType = query.get('recordType').prototype.className;
    payload.query.conditions = query.get('conditions');
    payload.query.parameters = query.get('parameters');
    payload.query.orderBy = query.get('orderBy');

    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    SC.Request.postUrl(this.URL)
      .header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchData', store, query)
      .send(payload);

    return YES;
  },

  didFetchData: function(response, store, query) {
    if(SC.ok(response)) {
      var results = JSON.parse(response.get("body").rows[0].fetch),
          recordType = query.get('recordType');

      results.forEach(function(dataHash) {
        store.pushRetrieve(recordType, dataHash.guid, dataHash);
      });
    } else {
      store.dataSourceDidErrorQuery(query, response);
    }
  },

  // ..........................................................
  // RECORD SUPPORT
  //

  retrieveRecord: function(store, storeKey, id) {
    var recordType = store.recordTypeFor(storeKey).prototype.className, 
        payload = new Object,
        id = id ? id : store.materializeRecord(storeKey).get('id');
    
    payload.requestType = 'retrieveRecord';
    payload.recordType = recordType;
    payload.id = id;
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    SC.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didRetrieveData', store, storeKey)
      .send(payload);

    return YES;
  },

  didRetrieveData: function(response, store, storeKey) {
    var error;
    
    if(SC.ok(response)) {
      var dataHash = JSON.parse(response.get("body").rows[0].retrieve_record);
      
      if(!dataHash.guid) {
        error = SC.Error.create({ 
          code: 'Error',
          label: 'Datasource Error',
          message: dataHash.error
        });
      } else {
        store.dataSourceDidComplete(storeKey, dataHash);
        return YES;
      }
    } 
    
    /* TODO: Why does this cause an internal inconsistency error? */
    store.dataSourceDidError(storeKey, error);
    
    return NO;
  },
  
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var storeKeys = createStoreKeys.concat(updateStoreKeys).concat(destroyStoreKeys),
        ret = YES;
    
    for(var i = 0; i < storeKeys.get('length'); i++) {
      if(!this.commitRecord(store, storeKeys[i])) { ret = NO };
    }

    return ret;
  },
  
  commitRecord: function(store, storeKey) {
    var recordType = store.recordTypeFor(storeKey).prototype.className, 
        payload = new Object,
        record = store.materializeRecord(storeKey);

    payload.requestType = 'commitRecord',
    payload.recordType = recordType;
    payload.dataHash = record.get('attributes');
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(JSON.stringify(payload))); }

    SC.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didCommitData', store, storeKey)
      .send(payload);

    return YES;
  },

  didCommitData: function(response, store, storeKey) {
    if(SC.ok(response)) {
      store.peekStatus(storeKey) === SC.Record.BUSY_DESTROYING ?
        store.dataSourceDidDestroy(storeKey) :
        store.dataSourceDidComplete(storeKey);
    } else {
      store.dataSourceDidError(storeKey, response);
    }
  },

});

XT.DataSource.start = function start() {
  var ds = XT.DataSource;
  ds.log("Starting up");
  ds.store = XT.Store = XT.Store.create().from("XT.DataSource");
  ds.pingServer();
  return YES;
} ;


