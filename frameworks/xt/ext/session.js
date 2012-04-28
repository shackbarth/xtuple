// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

sc_require('ext/request');
sc_require('ext/dispatch');
sc_require('ext/session_detail');
sc_require('delegates/session_delegate');

XT.SESSION_MULTIPLE     = 0x01;
XT.SESSION_ERROR        = 0x02;
XT.SESSION_VALID        = 0x04;
XT.SESSION_FORCE_NEW    = 'FORCE_NEW_SESSION';

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
  acquireSession: function(username, password, organization) {

    // retrieve the session delegate (if one was set or the default empty
    // one if not)
    var delegate = this.get('delegate');

    // this is just a parameter-hash to send to the datasource
    var session = {
      username: username,
      password: password,
      organization: organization
    };

    var details = XT.SessionDetail.create(session).freeze();
    
    // let the delegate know we're about to request a new session
    delegate.willAcquireSession(session);

    // issue the actual request
    XT.Request
      .issue('session/request')
      .notify(this, 'didAcquireSession', details)
      .json().send(session);
  },

  set: function(key, value) {
    if (key === 'details') {
      var details = this.get('details');
      if (details) details.destroy();
    }
    return arguments.callee.base.apply(this, arguments);
  },

  /**
  */
  didAcquireSession: function(response, details) {
    // SC.Logger.info("didAcquireSession()");

    // console.log("details ", details);

    this.set('details', details);

    // console.log("RESPONSE", response);

    var delegate = this.get('delegate');

    switch(response.code) {
      case XT.SESSION_ERROR:

        // temporary - true handling not known
        SC.Logger.error(response.data);
        break;
      case XT.SESSION_VALID:

        // copy the session data where it belongs
        var details = XT.SessionDetail
          .create(response.data).freeze();
        
        this.set('details', details);

        // the delegate need to know what the hell just
        // happened
        delegate.didAcquireSession(details);
  
        // WTF?!?
        XT.dataSource.set('isReady', true);

        break;
      case XT.SESSION_MULTIPLE:
        var self = this;
        var available = response.data;
        var ack = function(selection) {
          XT.Request
            .issue('session/select')
            .notify(self, 'didAcquireSession')
            .send(selection);
          this.isFired = true;
        }

        // allow the delegate to attempt to handle the
        // sessions situation and if it doesn't go ahead
        // and just force a new one to be created
        if (!delegate.didReceiveMultipleSessions(available, ack)) {
          SC.Logger.warn("Using the default to request new session even though multiple " +
            "sessions already exist");
          if (!ack.isFired) {
            ack(XT.SESSION_FORCE_NEW); 
          }
        }

        break;
      default:
        SC.Logger.error("ok, wtf, really?");
        console.error(response);
    }
     
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
  details: XT.SessionDetail.create(),

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
    this.set('locale', SC.Object.create(response));

    // Set globalization culture
    var culture = this.getPath('locale.culture');
    Globalize.culture(culture);

    return true;
  },

});


XT.ready(function() {
  XT.socket.on('session/new', function(response) {
    SC.Logger.info("Datasource pushed new session");
    XT.session.didAcquireSession(response);
  });


  XT.session.loadSessionObjects();
});
