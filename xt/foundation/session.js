
/**
*/
enyo.kind(
  /** @scope XT.Session.prototype */ {

  name: "XT.Session",
  
  kind: "Component",
  
  published: {
    details: {}
  },
  
  create: function() {
    this.inherited(arguments);
  },
  
  acquireSession: function(credentials, callback) {
    var self = this;
    var complete = function(payload) {
      self._didAcquireSession.call(self, payload, callback);
    };
    
    // we store these credentials until we have
    // acquired a valid session
    this.details = credentials;
    
    XT.Request
      .handle("session/request")
      .notify(complete)
      .send(credentials);
  },
  
  _didAcquireSession: function(payload, callback) {
    var self = this;
    var complete;
    
    // if this is a valid session acquisition, go ahead
    // and store the properties
    if (payload.code === 4) {
      this.setDetails(payload.data);
    }
    
    if (callback && callback instanceof Function) {
      callback(payload);
    }
    
    // // in the case where there are multiple sessions...
    // if (payload.code === 1) {
    //   complete = function(payload) {
    //     self._didAcquireSession.call(self, payload, callback);
    //   };
    //   
    //   // TEMPORARY!
    //   XT.Request
    //     .handle("session/select")
    //     .notify(complete)
    //     .send("FORCE_NEW_SESSION");
    // } else if (payload.code === 4) {
    //   
    //   // we're all ok, this is the valid state
    //   this.setDetails(payload.data);
    //   if (callback && callback instanceof Function) {
    //     callback(payload.data);
    //   } else { console.warn("NO CALLBACK FOR SESSION"); }
    // } else {
    //   console.error("What the $*&! is this session stuff", payload);
    // }
  }
    
});