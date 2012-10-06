/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  var _ = X._;
  
  X.Functor.create({
    
    handle: function (xtr) {
      
      // TODO: for REST to be able to work...a few notes for later
      // xtr.get("data") expects a hash result in this case...
     
     //X.debugging = true; 
     //X.debug("handle(functor, session): ", xtr.get("requestType"), xtr.get("data"), X.typeOf(xtr.get("data")));
      
      switch (xtr.get("requestType")) {
        case "session":
          this.validateSession(xtr);
          break;
      }
    },
    
    validateSession: function (xtr) {
      //X.log("requestSession(): ");
      var session = X.Session.create(xtr.get("payload"));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },
    
    ready: function (session, xtr) {
      //X.log("ready(): ", session.get("details"));
      session.removeAllListeners("isReady");
      
      session.set("socket", xtr.get("socket").id);
      
      // ugly much?
      session.once("didCommit", function () {
        //X.debugging = true;
        //X.debug("session.once.didCommit", session.get("details"));
        xtr.write({code: 1, data: session.get("details")}).close();
      });
    },
    
    error: function (session, xtr) {
      //X.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error(session.get("error"));
    },
    
    needsSession: false,
    handles: "session".w()
  });
}());
