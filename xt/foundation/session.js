
/**
*/
enyo.kind(
  /** @scope XT.Session.prototype */ {

  name: "XT.Session",
  
  kind: "Component",
  
  published: {
    details: {},
    availableSessions: [],
    privileges: {},
    settings: {},
    schema: {},
  },
  
  SETTINGS: 0x01,
  PRIVILEGES: 0x02,
  SCHEMA: 0x04,
  ALL: 0x01 | 0x02 | 0x04,
  
  create: function() {
    this.inherited(arguments);
  },
  
  /**
    Loads session objects for settings, preferences and privileges into local
    memory. Types `XT.session.SETTINGS` or `XT.session.PRIVILEGES` can be passed 
    as bitwise operators. If no arguments are passed the default is 
    `XT.session.ALL` which will load all session objects.
    
    @param {Number} Types
    @param {Object} Options
  */
  loadSessionObjects: function(types, options) {
    var that = this;
    var privilegesOptions;
    var privileges;
    var settingsOptions;
    var settings;
    var schemaOptions;
    var schema;

    if (types === undefined) types = this.ALL;

    if (types & this.PRIVILEGES) {
      privilegesOptions = options ? _.clone(options) : {};
      
      // callback
      privilegesOptions.success = function(resp, status, xhr) {
        privileges = new Backbone.Model();
        privileges.get = function(attr) {
          // Sometimes the answer is already known...
          if (_.isBoolean(attr)) return attr;
          return Backbone.Model.prototype.get.call(this, attr);
        };

        // Loop through the response and set a privilege for each found.
        resp.forEach(function(item) {
          privileges.set(item.privilege, item.isGranted);
        });

        // Attach the privileges to the session object.
        that.setPrivileges(privileges);
      };

      // dispatch
      XT.dataSource.dispatch('XT.Session', 'privileges', null, privilegesOptions);
    }

    if (types & this.SETTINGS) {
      settingsOptions = options ? _.clone(options) : {};
      
      // callback
      settingsOptions.success = function(resp, status, xhr) {
        settings = new Backbone.Model();

        // Loop through the response and set a setting for each found
        resp.forEach(function(item) {
          settings.set(item.setting, item.value);
        });

        // Attach the settings to the session object
        that.setSettings(settings);
      };

      XT.dataSource.dispatch('XT.Session', 'settings', null, settingsOptions);
    }
    
    if (types & this.SCHEMA) {
      schemaOptions = options ? _.clone(options) : {};
      
      // callback
      schemaOptions.success = function(resp, status, xhr) {
        schema = new Backbone.Model(resp);
        that.setSchema(schema);
      };

      XT.dataSource.dispatch('XT.Session', 'schema', 'xm', schemaOptions);
    }

    return true;
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
      
      XT.StartupTask.flush();
    }
    
    if (callback && callback instanceof Function) {
      callback(payload);
    }
  }
    
});

// ..........................................................
// CLASS CONSTANTS
//

enyo.mixin( XT.Session, {

  DB_BOOLEAN: 'B',
  DB_STRING: 'S',
  DB_COMPOUND: 'C',
  DB_DATE: 'D',
  DB_NUMBER: 'N',
  DB_ARRAY: 'A',
  DB_BYTEA: 'U',
  DB_UNKNOWN: 'X'
  
});