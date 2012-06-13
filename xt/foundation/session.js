
/**
*/
enyo.kind(
  /** @scope XT.Session.prototype */ {

  name: "XT.Session",
  
  kind: "Component",
  
  published: {
    details: {},
    availableSessions: []
  },
  
  create: function() {
    this.inherited(arguments);
  },
  
  selectSession: function(idx, callback) {
    var self = this;
    var complete = function(payload) {
      self._didAcquireSession.call(self, payload, callback);
    };
    
    XT.Request
      .handle("session/select")
      .notify(complete)
      .send(idx);
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
    
    // if there are multiple selection options
    if (payload.code === 1) {
      this.setAvailableSessions(payload.data);
    }
    
    // if this is a valid session acquisition, go ahead
    // and store the properties
    if (payload.code === 4) {
      this.setDetails(payload.data);
    }
    
    if (callback && callback instanceof Function) {
      callback(payload);
    }
  }
    
});