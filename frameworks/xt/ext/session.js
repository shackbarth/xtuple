// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('ext/request');
sc_require('ext/dispatch');
sc_require('delegates/session_delegate');

/**
  @instance
  @extends SC.Object
*/
XT.session = SC.Object.create(
  /** @lends XT.Session.prototype */ {

  //...........................................
  // METHODS
  //

  /**
  */
  acquireSession: function(username, password, organization, forceNew) {

    // retrieve the session delegate (if one was set or the default empty
    // one if not)
    var delegate = this.get('delegate');

    // this is just a parameter-hash to send to the datasource
    var session = {
      username: username,
      password: password,
      organization: organization,
      forceNew: !! forceNew
    };

    // let the delegate know we're about to request a new session
    delegate.willAcquireSession(session);

    // issue the actual request
    XT.Request
      .issue('session/request')
      .notify(this, 'didAcquireSession', delegate)
      .json().send(session);
  },

  /**
  */
  didAcquireSession: function(response, delegate) {
    SC.Logger.info("didAcquireSession() with response", response);
    console.log(response);
  },

  //...........................................
  // PROPERTIES
  //

  /**
    The session delegate receives calls on specific
    events related to the session.

    @property
    @default XT.SessionDelegate
  */
  delegate: XT.SessionDelegate,

  SETTINGS:         0x01,
  PRIVILEGES:       0x02,
  LOCALE:           0x04,
  ALL:              0x01 | 0x02 | 0x04,

  /** @private */
  store: function() {
    return XT.store;
  }.property().cacheable(),

  /**
  */
  payloadAttributes: function() {
    var sid = this.get('sid');
    var username = this.get('username');
    var lastModified = this.get('lastModified');
    var created = this.get('created');
    var organization = this.get('organization');
    return {
      sid: sid,
      username: username,
      lastModified: lastModified,
      created: created,
      organization: organization
    };
  }.property(),

  sid: null,
  username: null,
  lastModified: null,
  created: null,
  organization: null,

  /**
    Loads session objects for settings, preferences and privileges into local
    memory. Types `XT.session.SETTINGS`, `XT.session.LOCALE` or types
    `XT.session.PRIVILEGES` can be passed as bitwise operators. If no
    arguments are passed the default is `XT.session.ALL` which will load all
    session objects.
  */
  loadSessionObjects: function(types) {
    var self = this,
        store = this.get('store'),
        dispatch, callback;

    if (types === undefined) types = this.ALL;

    if (types & this.PRIVILEGES) {
      dispatch = XT.Dispatch.create({
        className: 'XT.Session',
        functionName: 'privileges',
        target: self,
        action: self.didFetchPrivileges
      });

      store.dispatch(dispatch);
    }

    if (types & this.SETTINGS) {
      dispatch = XT.Dispatch.create({
        className: 'XT.Session',
        functionName: 'settings',
        target: self,
        action: self.didFetchSettings
      });

      store.dispatch(dispatch);
    }

    if (types & this.LOCALE) {
      dispatch = XT.Dispatch.create({
        className: 'XT.Session',
        functionName: 'locale',
        target: self,
        action: self.didFetchLocale
      });

      store.dispatch(dispatch);
    }

    return true;
  },

  didFetchSettings: function(error, response) {
    // Create an object for settings.
    var that = this,
        settings = SC.Object.create({
          // Return false if property not found
          get: function(key) {
            for (var prop in this) {
              if (prop === key) return this[prop];
            }

            return false;
          },

          set: function(key, value) {
            this.get('changed').push(key);

            arguments.callee.base.apply(this, arguments);
          },

          changed: []
        });

    // Loop through the response and set a setting for each found
    response.forEach(function(item) {
      settings.set(item.setting, item.value);
    });

    settings.set('changed', []);

    // Attach the settings to the session object
    this.set('settings', settings);

    return true;
  },

  didFetchPrivileges: function(error, response) {
    // Create a special object for privileges where the get function returns
    // `false` if it can't find the key.
    var privileges = SC.Object.create({
      get: function(key) {
        if (typeof key === 'boolean') return key;

        for (var prop in this) {
          if (prop === key) return this[prop];
        }

        return false;
      }
    });

    // Loop through the response and set a privilege for each found.
    response.forEach(function(item) {
      privileges.set(item.privilege, item.isGranted);
    });

    // Attach the privileges to the session object.
    this.set('privileges', privileges);

    return true;
  },

  didFetchLocale: function(error, response) {
    // Attach the locale to the session object.
    this.set('locale', response);

    return true;
  },

});
