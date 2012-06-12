
/**
*/
enyo.kind(
  /** @scope XT.Response.prototype */ {

  name: "XT.Data",
  
  kind: "Component",

  /*
  Returns a record array based on a query.
  */
  fetch: function(query, options) {
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].fetch);
      if (dataHash.error && options && options.error) {  
        error.call(that, response);
      } else if (options && options.success) { 
        success.call(that, dataHash); 
      }
    };
  
    payload.requestType = 'fetch';
    payload.query = query;
  
    XT.Request
      .handle("function/fetch")
      .notify(complete)
      .send(payload); 
  },

  /*
  Returns a single record.
  
  @param {String} record type
  @param {Number} id
  @param {Object} options
  */
  retrieveRecord: function(recordType, id, options) {
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].retrieve_record);
      if (dataHash.error && options && options.error) { 
        error.call(that, response);
      } else if (options && options.success) { 
        success.call(that, dataHash); 
      }
    };
    
    payload.requestType = 'retrieveRecord';
    payload.recordType = recordType;
    payload.id = id;
    
    XT.Request
      .handle("function/retrieveRecord")
      .notify(complete)
      .send(payload); 
  },
  
  /*
  Commit a single record.
  
  @param {XT.Model} model
  @param {Object} options
  */
  commitRecord: function(model, options) {
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].commit_record);
      if (dataHash.error && options && options.error) { 
        options.error.call(that);
      } else if (options && options.success) { 
        options.success.call(that); 
      }
    };
    
    payload.requestType = 'commitRecord';
    payload.recordType = model.recordType;
    payload.dataHash = model.toJSON();
    
    XT.Request
      .handle("function/commitRecord")
      .notify(complete)
      .send(payload); 
  },
  
  /*
  Dispatch a server side function call to the datasource.
  
  @param {String} class name
  @param {String} function name
  @param {Object} parameters
  @param {Function} success callback
  @param {Function} error callback
  */
  /** @private */
  dispatch: function (name, func, params, options) {
    var payload = {
      requestType: 'dispatch',
      className: name,
      functionName: func,
      parameters: params
    };
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].dispatch);
      if (dataHash.error && options && options.error) {  
        options.error.call(that, response);
      } else if (options && options.success) { 
        options.success.call(that, dataHash); 
      }
    };

    XT.Request
      .issue('function/dispatch')
      .notify(complete)
      .send(payload);
  },
    
});