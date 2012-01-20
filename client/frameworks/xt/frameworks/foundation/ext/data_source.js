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

XT.DataSource = SC.DataSource.extend(
/** @scope XT.DataSource.prototype */ {

  URL: '/data',
  
  debug: YES,
  
  // ..........................................................
  // QUERY SUPPORT
  //

  fetch: function(store, query) {
    var payload = new Object, json = {};
    
    payload.requestType = 'fetch',
    payload.recordType = query.get('recordType').toString();
    
    payload.query = new Object;
    payload.query.conditions = query.get('conditions');
    payload.query.parameters = query.get('parameters');
    payload.query.orderBy = query.get('orderBy');
    
    json = JSON.stringify(payload)
    
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(json)); }

    SC.Request.postUrl(this.URL)
      .header({'Accept': 'application/json'}).json()
      .notify(this, 'didFetchData', store, query)
      .send(json);

    return YES;
  },

  didFetchData: function(response, store, query) {
    if(SC.ok(response)) {
      var body = response.get("body"),
          recordType = query.get('recordType');
      
      body.forEach(function(dataHash) {
        store.pushRetrieve(recordType, row.guid, dataHash);
      });
    } else {
      store.dataSourceDidErrorQuery(query, response);
    }
  },

  // ..........................................................
  // RECORD SUPPORT
  //

  retrieveRecord: function(store, storeKey, id) {
    var recordType = store.recordTypeFor(storeKey).toString(), 
        payload = new Object, json = {};
    
    payload.requestType = 'retrieveRecord',
    payload.recordType = recordType;
    payload.id = id;
    
    json = JSON.stringify(payload);
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(json)); }

    SC.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didRetrieveData', store, storeKey)
      .send(json);

    return YES;
  },

  didRetrieveData: function(response, store, storeKeys) {
    if(SC.ok(response)) {
      var dataHash = response.get("body");
        store.dataSourceDidComplete(storeKey, dataHash);
    } else {
      store.dataSourceDidError(storeKey, response);
    }
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
    var recordType = store.recordTypeFor(storeKey).toString(), 
        payload = new Object, json = {};
        record = store.materializeRecord(storeKey);

    payload.requestType = 'commitRecord',
    payload.recordType = recordType;
    payload.dataHash = JSON.stringify(record);
  
    json = JSON.stringify(payload);
  
    if(this.get('debug')) { console.log("JSON PAYLOAD: %@".fmt(json)); }

    SC.Request.postUrl(this.URL)
      .header({ 'Accept': 'application/json' }).json()
      .notify(this, 'didCommitData', store, storeKey)
      .send(json);

    return YES;
  },

  didCommitData: function(response, store, storeKey) {
    if(SC.ok(response)) {
      store.dataSourceDidComplete(storeKey);
    } else {
      store.dataSourceDidError(storeKey, response);
    }
  },

});



