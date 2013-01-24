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
          console.log("session socket.io payload: ", payload);
          self._didValidateSession.call(self, payload, callback);
        };

      //XT.dataSource._sock.on('message', complete(message));

      XT.Request
        .handle("session")
        .notify(complete)
        .send(null);
    },

    _didValidateSession: function (payload, callback) {
      // if this is a valid session acquisition, go ahead
      // and store the properties
      if (payload.code === 1) {
        this.setDetails(payload.data);
        XT.getStartupManager().start();
      } else {
        return relocate();
      }

      if (callback && callback instanceof Function) {
        callback(payload);
      }
    },

    start: function () {
      //XT.getStartupManager().start();
      //XT.app.show();

      try {
        this.validateSession(function () { XT.app.show(); });
      } catch (e) { XT.Session.logout(); }
    },

    logout: function () {
      XT.Request
        .handle("function/logout")
        .notify(function () {
          relocate();
        })
        .send();
    }

  };

}());
