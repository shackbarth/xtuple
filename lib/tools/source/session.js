/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, setTimeout: true, enyo:true */

(function () {
  "use strict";

  XT.Session = {
    /** @scope XT.Session */

    details: {},
    config: {},
    availableSessions: [],
    privileges: {},
    settings: {},
    schema: {},
    extensions: {},

    getAvailableSessions: function () {
      return this.availableSessions;
    },

    getConfig: function () {
      return this.config;
    },

    getDetails: function () {
      return this.details;
    },

    setAvailableSessions: function (value) {
      this.availableSessions = value;
      return this;
    },

    setConfig: function (value) {
      this.config = value;
      return this;
    },

    setDetails: function (value) {
      this.details = value;
      return this;
    }
  };
}());
