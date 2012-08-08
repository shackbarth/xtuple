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

    SETTINGS: 0x01,
    PRIVILEGES: 0x02,
    SCHEMA: 0x04,
    LOCALE: 0x08,
    ALL: 0x01 | 0x02 | 0x04 | 0x08,

    /**
      Loads session objects for settings, preferences and privileges into local
      memory. Types `XT.session.SETTINGS` or `XT.session.PRIVILEGES` can be passed
      as bitwise operators. If no arguments are passed the default is
      `XT.session.ALL` which will load all session objects.

      @param {Number} Types
      @param {Object} Options
    */
    loadSessionObjects: function (types, options) {
      var that = this,
        privilegesOptions,
        privileges,
        settingsOptions,
        settings,
        schemaOptions,
        callback;

      if (options && options.success && options.success instanceof Function) {
        callback = options.success;
      } else { callback = XT.K; }

      if (types === undefined) { types = this.ALL; }

      if (types & this.PRIVILEGES) {
        privilegesOptions = options ? _.clone(options) : {};

        // callback
        privilegesOptions.success = function (resp) {
          privileges = new Backbone.Model();
          privileges.get = function (attr) {
            // Sometimes the answer is already known...
            if (_.isBoolean(attr)) { return attr; }
            return Backbone.Model.prototype.get.call(this, attr);
          };

          // Loop through the response and set a privilege for each found.
          resp.forEach(function (item) {
            privileges.set(item.privilege, item.isGranted);
          });

          // Attach the privileges to the session object.
          that.setPrivileges(privileges);

          callback();
        };

        // dispatch
        XT.dataSource.dispatch('XT.Session', 'privileges', null, privilegesOptions);
      }

      if (types & this.SETTINGS) {
        settingsOptions = options ? _.clone(options) : {};

        // callback
        settingsOptions.success = function (resp) {
          settings = new Backbone.Model();

          // Loop through the response and set a setting for each found
          resp.forEach(function (item) {
            settings.set(item.setting, item.value);
          });

          // Attach the settings to the session object
          that.setSettings(settings);

          callback();
        };

        XT.dataSource.dispatch('XT.Session', 'settings', null, settingsOptions);
      }

      if (types & this.SCHEMA) {
        schemaOptions = options ? _.clone(options) : {};

        // callback
        schemaOptions.success = function (resp) {
          var schema = new Backbone.Model(resp),
            prop,
            Klass,
            relations,
            i;
          that.setSchema(schema);

          // Set relations
          for (prop in schema.attributes) {
            if (schema.attributes.hasOwnProperty(prop)) {
              Klass = XM.Model.getObjectByName('XM' + '.' + prop);
              if (Klass) {
                relations = schema.attributes[prop].relations || [];
                if (relations.length) {
                  Klass.prototype.relations = [];
                  for (i = 0; i < relations.length; i++) {
                    if (relations[i].type === "Backbone.HasOne") {
                      relations[i].type = Backbone.HasOne;
                    } else if (relations[i].type === "Backbone.HasMany") {
                      relations[i].type = Backbone.HasMany;
                    } else {
                      continue;
                    }
                    Klass.prototype.relations.push(relations[i]);
                  }
                }

                privileges = schema.attributes[prop].privileges;
                if (privileges) {
                  Klass.prototype.privileges = privileges;
                }
              }
            }
          }

          callback();
        };

        XT.dataSource.dispatch('XT.Session', 'schema', 'xm', schemaOptions);
      }

      if (types & this.LOCALE) {

        // TEMPORARY IMPLEMENTATION TO INTERPRET FROM SOURCE
        if (XT.lang) {
          XT.locale.setLanguage(XT.lang);
        } else {
          XT.log("XT.session.loadSessionObjects(): could not find " +
            "a valid language to load");
        }

        if (callback && callback instanceof Function) {
          setTimeout(callback, 1);
        }
      }

      return true;
    },

    selectSession: function (idx, callback) {
      var self = this,
        complete = function (payload) {
          self._didAcquireSession.call(self, payload, callback);
        };

      XT.Request
        .handle("session/select")
        .notify(complete)
        .send(idx);
    },

    getAvailableSessions: function () {
      return this.availableSessions;
    },

    getDetails: function () {
      return this.details;
    },

    getSchema: function () {
      return this.schema;
    },

    getSettings: function () {
      return this.settings;
    },

    getPrivileges: function () {
      return this.privileges;
    },

    setAvailableSessions: function (value) {
      this.availableSessions = value;
      return this;
    },

    setDetails: function (value) {
      this.details = value;
      return this;
    },

    setSchema: function (value) {
      this.schema = value;
      return this;
    },

    setSettings: function (value) {
      this.settings = value;
      return this;
    },

    setPrivileges: function (value) {
      this.privileges = value;
      return this;
    },

    validateSession: function (credentials, callback) {
      var self = this,
        complete = function (payload) {
          self._didValidateSession.call(self, payload, callback);
        };

      // we store these credentials until we have
      // acquired a valid session
      this.details = credentials;

      XT.Request
        .handle("session")
        .notify(complete)
        .send(credentials);
    },

    _didValidateSession: function (payload, callback) {
      var h = document.location.hostname;

      // if this is a valid session acquisition, go ahead
      // and store the properties
      if (payload.code === 1) {
        this.setDetails(payload.data);
        XT.getStartupManager().start();
      } else {
        return document.location = "https://%@/login".f(h);
      }

      if (callback && callback instanceof Function) {
        callback(payload);
      }
    },

    start: function () {
      var c = enyo.getCookie("xtsessioncookie");
      try {
        c = JSON.parse(c);
        this.validateSession(c, function () { XT.app.show(); });
      } catch (e) { XT.Session.logout(); }
    },

    logout: function () {
      var h = document.location.hostname;
      XT.Request
        .handle("function/logout")
        .notify(function () {
          document.location = "https://%@/login".f(h);
        })
        .send();
    },

    // ..........................................................
    // CLASS CONSTANTS
    //

    DB_BOOLEAN: 'B',
    DB_STRING: 'S',
    DB_COMPOUND: 'C',
    DB_DATE: 'D',
    DB_NUMBER: 'N',
    DB_ARRAY: 'A',
    DB_BYTEA: 'U',
    DB_UNKNOWN: 'X'

  };

}());
