/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, setTimeout: true, enyo:true */

(function () {
  "use strict";

  /**
  */
  XT.Session = {
    /** @scope XT.Session */

    details: {},
    availableSessions: [],
    privileges: {},
    settings: {},
    schema: {},
    extensions: {},

    getAvailableSessions: function () {
      return this.availableSessions;
    },

    getDetails: function () {
      return this.details;
    },

    setAvailableSessions: function (value) {
      this.availableSessions = value;
      return this;
    },

    setDetails: function (value) {
      this.details = value;
      return this;
    },

    validateSession: function (callback) {
      var self = this,
        complete = function (payload) {
          self._didValidateSession.call(self, payload, callback);
        };

      // Poll the session socket.io endpoint for valid session data.
      XT.Request
        .handle("session")
        .notify(complete)
        .send(null);
    },

    _didValidateSession: function (payload, callback) {
      if (payload.code === 1) {
        // If this is a valid session acquisition, go ahead
        // and store the properties in XT.Session.details.
        this.setDetails(payload.data);

        // Start the client loading process.
        XT.getStartupManager().start();
      } else {
        return XT.Session.logout();
      }

      if (callback && callback instanceof Function) {
        callback();
      }
    },

    start: function () {
      try {
        this.validateSession(function () {
          // Tell the client to show now that we're in startup mode.
          XT.app.show();
        });
      } catch (e) {
        XT.Session.logout();
      }
    },

    logout: function () {
      // XXX window is only defined in the browser. Node shouldn't use this function.
      if (window.onbeforeunload) {
        // if we've set up a "are you sure you want to leave?" warning, disable that
        // here. Presumably we've already asked if they want to leave.
        // delete window.onbeforeunload; // doesn't work
        window.onbeforeunload = undefined;
      }
      window.location = "/logout";
    }

  };

}());
