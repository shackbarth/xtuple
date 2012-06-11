
enyo.kind(
  /** @scope XT.DataSource.prototype */ {
  
  name: "XT.DataSource",
  
  kind: "Component",
  
  published: {
    datasourceUrl: "localhost",
    datasourcePort: 9000,
    isConnected: false
  },
  
  create: function() {
    this.inherited(arguments);
    this._connect();
  },
  
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
  },
  
  /**
  */
  _sockDidError: function(err) {
    // TODO: need some handling here
    console.warn(err);
  },
  
  /**
  */
  _sockDidConnect: function() {
    
    enyo.log("Successfully connected to the datasource");
    
    this.setIsConnected(true);
    
    // go ahead and create the session object for the
    // application if it does not already exist
    if (!XT.session) {
      XT.session = new XT.Session();
    }
  }
  
});