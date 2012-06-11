
/**
*/
enyo.kind(
  /** @scope XT.Request.prototype */ {
   
  name: "XT.Request",
  
  kind: "Component",
  
  create: function() {
    this.inherited(arguments);
  },
  
  send: function(data) {
    var details = XT.session.details;
    var sock = XT.dataSource._sock;
    var notify = this._notify;
    var handle = this._handle;
    var payload = {
      payload: data
    };
    var callback;
    
    if (!notify || !(notify instanceof Function)) {
      callback = XT.K;
    } else {
      callback = function(response) {
        notify(new XT.Response(response));
      };
    }
    
    // attach the session details to the payload
    payload = enyo.mixin(payload, details);
    
    enyo.log("Socket sending: %@".f(handle), payload);
    
    sock.json.emit(handle, payload, callback);
  },
  
  handle: function(event) {
    this._handle = event;
    return this;
  },
  
  notify: function(method) {
    var args = Array.prototype.slice.call(arguments).slice(1);
    this._notify = function(response) {
      args.unshift(response);
      method.apply(window, args);
    };
    return this;
  } 
    
});

/**
*/
enyo.mixin(XT.Request,
  /** @scope XT.Request */ {
   
  handle: function(event) {
    var req = new XT.Request();
    req._handle = event;
    return req;
  },
  
  notify: function(method) {
    var req = new XT.Request();
    var args = Array.prototype.slice.call(arguments).slice(1);
    req._notify = function(response) {
      args.unshift(response);
      method.apply(window, args);
    };
    return req;
  }
    
});
