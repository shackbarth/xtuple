
/**
*/
enyo.kind(
  /** @scope XT.Response.prototype */ {

  name: "XT.Data",
  
  kind: "Component",

  /*
  returns a record array based on a query.
  */
  fetch: function(query, success, error) {
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].fetch);
      if (dataHash.error) { 
        error.call(that, response);
      } else { 
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
  returns a single record.
  */
  retrieveRecord: function(recordType, id, success, error) {
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash = JSON.parse(response.data.rows[0].retrieve_record);
      if (dataHash.error) { 
        error.call(that, response);
      } else { 
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
  }
    
});