/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
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
      session.removeAllListeners();
      
      // ugly much?
      xtr.write({code: 4, data: session.get("details")}).close();
    },
    
    multiple: function (session, xtr) {
      //XT.log("multiple(): ");
      session.removeAllListeners();
      
      // ugly much?
      xtr.write({code: 1, data: session.get("available")}).close();
    },
    
    error: function (session, xtr) {
      //XT.log("error(): ");
      session.removeAllListeners();
      xtr.error(session.get("error"));
    },
    
    select: function (session, xtr) {
      //XT.log("select(): ");
      session.removeAllListeners();
      session.selectSession(xtr.get("data"));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
    },
    
    needsSession: false,
    handles: "session/request session/select".w()
    
  });
  
}());

/** @class
*/
//XT.Functor.create(
//  /** @lends ... */ {

// /** @private */
// handle: function(payload, session, ack, handling) {
//     if (handling === 'session/select') {
//       if (payload === XT.SESSION_FORCE_NEW) {
//         session.forceNew().ready(function(session) {
//           var state = session.get('state');
//           if (state === XT.SESSION_ERROR) {
//             ack(session.get('error'), session);
//           } else {
//             // we assume valid
//             session.set('state', XT.SESSION_VALID);
//             ack(session.get('details'), session);
//           }
//         });
//       } else {
//         var available = session.get('available');
//         var sid;
//         
//         // so we need to account for the case when a selection is
//         // made for a bad session or a session that expired before
//         // the selection was made
//         if (available && available.length >= payload) {
//           
//           // TODO: eh this probably shouldn't be in a try catch...
//           try {
//             sid = available[payload].sessionData.sid;
//           } catch(err) { sid = null; }
//         } else { sid = null; }
//
//         session.set('sid', sid);
//         session.load().ready(function(session) {
//           if (session.get('state') === XT.SESSION_ERROR) {
//             ack(session.get('error'), session);
//           } else {
//             ack(session.get('details'), session);
//           }
//         });
//       }
//     } else {
//
//       // we ignore the normal session object because it had
//       // to have failed without the credentials in the payload
//       var organization = payload.organization;
//       var username = payload.username;
//       var password = payload.password;
//
//       // the session will attempt to authenticate the user
//       // because of the credentials that are being passed in
//       XT.Session.create({
//         username: username,
//         password: password,
//         organization: organization
//       }).ready(function(session) {
//         var state = session.get('state');
//         if (state === XT.SESSION_ERROR) {
//           ack(session.get('error'), session); 
//         } else if (state === XT.SESSION_MULTIPLE) {
//           var available = session.get('available');
//           ack(available, session);
//         } else if (state === XT.SESSION_VALID) {
//           ack(session.get('details'), session);
//         }
//       });
//     }
// },

//  /** @private */
//  handles: "session/request session/select".w(),
//  
//});
