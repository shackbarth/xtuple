/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.Functor.create({
    
    handle: function (xtr) {
      
      // TODO: for REST to be able to work...a few notes for later
      // xtr.get("data") expects a hash result in this case...
      
      XT.log("handle(): ", xtr.get("requestType"), xtr.get("data"), XT.typeOf(xtr.get("data")));
      
      switch (xtr.get("requestType")) {
        case "session":
          this.validateSession(xtr);
          break;
      }
    },
    
    validateSession: function (xtr) {
      //XT.log("requestSession(): ");
      var session = XT.Session.create(xtr.get("payload"));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },
    
    ready: function (session, xtr) {
      //XT.log("ready(): ");
      session.removeAllListeners("isReady");
      
      // ugly much?
      xtr.write({code: 1, data: session.get("details")}).close();
    },
    
    error: function (session, xtr) {
      XT.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error(session.get("error"));
    },
    
    needsSession: false,
    handles: "session".w()
  });
}());