/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true, setTimeout: true, enyo:true */

(function () {
  "use strict";

  /**
  */
  _.extend(XT.Session, {
    /** @scope XT.Session */

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
        localeOptions,
        callback;

      if (options && options.success && options.success instanceof Function) {
        callback = options.success;
      } else { callback = XT.K; }

      if (types === undefined) { types = this.ALL; }

      if (types & this.PRIVILEGES) {
        privilegesOptions = options ? _.clone(options) : {};

        // callback
        privilegesOptions.success = function (resp) {
          var i;
          privileges = new Backbone.Model();
          privileges.get = function (attr) {
            // Sometimes the answer is already known...
            if (_.isBoolean(attr)) { return attr; }
            return Backbone.Model.prototype.get.call(this, attr);
          };

          // Loop through the response and set a privilege for each found.
          for (i = 0; i < resp.length; i++) {
            privileges.set(resp[i].privilege, resp[i].isGranted);
          }

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
          settings = new Backbone.Model(resp);

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
          var schema,
            prop,
            Klass,
            relations,
            i;

          if (that.getSchema().attributes) {
            // add incoming data to already loaded schema attributes
            schema = that.getSchema();
            schema.set(resp);

          } else {
            // create schema as a new model
            schema = new Backbone.Model(resp);
            that.setSchema(schema);
          }
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

        // get schema for instance DB models
        XT.dataSource.dispatch('XT.Session', 'schema', 'xm', schemaOptions);

        // get schema for global DB models
        schemaOptions.databaseType = 'global';
        XT.dataSource.dispatch('XT.Session', 'schema', 'xm', schemaOptions);
      }

      if (types & this.LOCALE) {
        localeOptions = options ? _.clone(options) : {};

        // callback
        localeOptions.success = function (resp) {
          var locale = new Backbone.Model(resp);
          that.setLocale(locale);
          callback();
        };

        XT.dataSource.dispatch('XT.Session', 'locale', null, localeOptions);
      }

      return true;
    },

    getLocale: function () {
      return this.locale;
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

    setLocale: function (value) {
      this.locale = value;
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

  });

}());
