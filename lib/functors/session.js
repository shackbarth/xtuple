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
      
      ////XT.log("handle(): ", xtr.get("requestType"), xtr.get("data"), XT.typeOf(xtr.get("data")));
      
      switch (xtr.get("requestType")) {
        case "session/request":
          this.requestSession(xtr);
          break;
        case "session/select":
          this.selectSession(xtr);
          break;
      }
    },
    
    requestSession: function (xtr) {
      //XT.log("requestSession(): ");
      var session = XT.Session.create(xtr.get("payload"));
      session.once("isMultiple", _.bind(this.multiple, this, session, xtr));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },
    
    selectSession: function (xtr) {;
      var session = XT.Session.create(xtr.get("payload"));
      session.once("isMultiple", _.bind(this.select, this, session, xtr));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },
    
    ready: function (session, xtr) {
      //XT.log("ready(): ");
      session.removeAllListeners("isMultiple");
      session.removeAllListeners("isReady");
      
      // ugly much?
      xtr.write({code: 4, data: session.get("details")}).close();
    },
    
    multiple: function (session, xtr) {
      //XT.log("multiple(): ");
      session.removeAllListeners("isMultiple");
      session.removeAllListeners("isReady");
      
      // ugly much?
      xtr.write({code: 1, data: session.get("available")}).close();
    },
    
    error: function (session, xtr) {
      XT.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error(session.get("error"));
    },
    
    select: function (session, xtr) {
      //XT.log("select(): ");
      session.removeAllListeners("isReady");
      session.selectSession(xtr.get("data"));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
    },
    
    needsSession: false,
    handles: "session/request session/select".w()
    
  });
  
}());