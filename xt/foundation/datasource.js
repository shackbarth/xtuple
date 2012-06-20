
enyo.kind(
  /** @scope XT.DataSource.prototype */ {
  
  name: "XT.DataSource",
  
  kind: "Component",
  
  published: {
    datasourceUrl: "asteroidbelt.xtuple.com",
    //datasourceUrl: "localhost",
    datasourcePort: 9000,
    isConnected: false
  },
  
  create: function() {
    this.inherited(arguments);
    this._connect();
  },
  
  /*
  Returns a record array based on a query.
  
  @param {Object} query
  @param {Object} options
  */
  fetch: function(options) {
    options = options ? _.clone(options) : {};
    var that = this;
    var payload = {};
    var complete = function(response) {
      var dataHash;
      
      // handle error
      if (response.data.isError) { 
        if (options && options.error) options.error.call(that);
        return;
      }
      
      // handle success
      dataHash = JSON.parse(response.data.rows[0].fetch);
      if (options && options.success) { 
        options.success.call(that, dataHash); 
      }
    };
  
    payload.requestType = 'fetch';
    payload.query = options.query;
  
    return XT.Request
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
      var dataHash;
      
      // handle error
      if (response.data.isError) { 
        if (options && options.error) options.error.call(that);
        return;
      }
      
      // handle success
      dataHash = JSON.parse(response.data.rows[0].retrieve_record);
      if (options && options.success) { 
        options.success.call(that, dataHash); 
      }
    };
    
    payload.requestType = 'retrieveRecord';
    payload.recordType = recordType;
    payload.id = id;
    
    return XT.Request
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
      var dataHash;
    
      // handle error
      if (response.data.isError) { 
        if (options && options.error) options.error.call(that);
        return;
      }
      
      // handle ok or complete hash response
      dataHash = JSON.parse(response.data.rows[0].commit_record);
      if (options && options.success) { 
        options.success.call(that, dataHash ); 
      }
    };
    
    payload.requestType = 'commitRecord';
    payload.recordType = model.recordType;
    payload.requery = options.requery;
    payload.dataHash = model.toJSON();
    
    return XT.Request
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
    var that = this;
    var payload = {
      requestType: 'dispatch',
      className: name,
      functionName: func,
      parameters: params
    };
    var complete = function(response) {
      var dataHash;
      
      // handle error
      if (response.data.isError) { 
        if (options && options.error) options.error.call(that);
        return;
      }
      
      // handle success
      dataHash = JSON.parse(response.data.rows[0].dispatch);
      if (options && options.success) { 
        options.success.call(that, dataHash); 
      }
    };

    return XT.Request
             .handle('function/dispatch')
             .notify(complete)
             .send(payload);
  },
  
  /* @private */
  _connect: function() {
    if (this.isConnected) return;
    
    enyo.log("Attempting to connect to the datasource");
    
    var url = this.datasourceUrl;
    var port = this.datasourcePort;
    var datasource = "http://%@:%@/client".f(url, port);
    var self = this;
    var didConnect = this._sockDidConnect;
    var didError = this._sockDidError;
    
    // attempt to connect and supply the appropriate
    // responders for the connect and error events
    this._sock = io.connect(datasource);
    this._sock.on("connect", function() {
      didConnect.call(self);
    });
    this._sock.on("error", function(err) {
      didError.call(self, err);
    });
    this._sock.on("debug", function(msg) {
      self.log("SERVER DEBUG => ", msg);
    });
  },
  
  /* @private */
  _sockDidError: function(err) {
    // TODO: need some handling here
    console.warn(err);
  },
  
  /* @private */
  _sockDidConnect: function() {
    
    enyo.log("Successfully connected to the datasource");
    
    this.setIsConnected(true);
    
    // go ahead and create the session object for the
    // application if it does not already exist
    if (!XT.session) {
      XT.session = new XT.Session();
    }
  },
  
  reset: function() {
    if (!this.getIsConnected()) {
      return;
    }
    
    var sock = this._sock;
    if (sock) {
      sock.disconnect();
      this.setIsConnected(false);
    }
    
    this._connect();
  }
  
});