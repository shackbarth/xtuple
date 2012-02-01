/*globals XM */

sc_require('ext/object');
sc_require('ext/data_source');

XM.SESSION_COOKIE_STRING = "XTUPLEACTIVESESSIONCOOKIE";
XM.SESSION_COOKIE_EXPIRE = 10;
XM.SESSION_COOKIE_SECURE = YES;

XM.Session = XM.Object.create(
  /** @scope XM.Session.prototype */ {
  
  /** @property */
  name: "XM.Session",

  /** @property */
  isActive: NO,

  /** @property */
  loginIsEnabled: NO,

  /** @property */
  loginInputIsEnabled: YES,

  //.................................................
  // Private Methods
  //

  /** @private
    Initializes the statechart for the session. It defaults
    to LOGGEDOUT and will catch events if the user is determined
    to be logged into an active session.
  */
  start: function() {

    // attempt to grab a session cookie, will return false if
    // no cookie exists
    var c = SC.Cookie.find(XM.SESSION_COOKIE_STRING);

    if(!c || SC.none(c)) c = this._newCookie(); 
    else this._cookie = c;

    // if at this point we don't have a valid cookie for any reason
    // we have to fail the app :(
    if (!c || SC.none(c) || !c.isCookie) {
      this.error(
        "Could not generate the necessary session cookie. Perhaps secure " +
        "cookies are disabled or unsupported by the server?", YES
      );
    }

    // this is where asynchronous startup begins for the session
    // ask the server if we have a valid session or need a new one
    this._validateSession();
    
    // task states require some type of feedback even though
    // this task is run asynchronously
    return YES;
  },

  /** @private */
  _newCookie: function() {
    var c = SC.Cookie.create({
      name: XM.SESSION_COOKIE_STRING
      // secure: XM.SESSION_COOKIE_SECURE,
      // expires: SC.DateTime.create().advance({
      //   minute: XM.SESSION_COOKIE_EXPIRE }),
    });
    if (!SC.none(c) && c.isCookie === YES) this.set("_cookie", c);
    return c;
  },

  /** @private */
  _validateSession: function() {

    // @todo As of 11/3/2011 the datasource was not set up to
    //  handle sessions yet so this is hacked to compensate
    //  temporarily
    var c = this.get("cookie"),
        s = this.statechart, v;
    if(c) v = c.get("value");
    if(v) v = JSON.parse(v);

    //if(!v || SC.none(v) || !v.sid) 
    //  return s.sendEvent("needSession");

    if(v.username) {
      this.set("_username", v.username);
      s.sendEvent("needSession");
      
      if(v.sid) {
        XM.MessageController.set("loadingStatus", "_usePrevSession".loc());
        this.invokeLater(function() { s.sendEvent("submit"); }, 1000);
      }
    } else { return s.sendEvent("needSession"); }
    
  },

  /** @private */
  _writeSession: function() {

    var c = this.get("cookie");

    if(!c) this.error("Could not write session!", YES);  
    c.set("value", JSON.stringify({
      username: this.get("_username"),


      // JUST FOR TESTING!
      sid: this._session_id
    })).write();
    return YES;
  },

  /** @private */
  _login: function() {
    if (this.get("isActive") === YES) {
      this.error("Attempt to login after already logged in", YES);
    }
    var self = this; 

    // since there server cannot yet do this we must pretend
    setTimeout(function() {
      self.statechart.sendEvent("success"); 
    }, 1000);
  },

  /** @private */
  _acquireSessionId: function() {

    if(!this.get("_serverIsAvailable")) {
      return this.error("Cannot acquire a session, no server is available", YES);
    }

    var u = this.get("_username"),
        p = this.get("_password"),
        json;
    this.set("_password", null);
    json = {
      name: "XM.SessionFunctor",
      username: u,
      password: p
    };
    
    SC.Request.postUrl(XM.DataSource.URL)
      .header({ "Accept": "application/json" }).json()
      .notify(this, "_receivedSessionResponse")
      .timeoutAfter(1000)
      .send(json);

    return YES;
  },

  /** @private */
  _receivedSessionResponse: function(response) {
    var r = response, s = this.statechart;
    if(!SC.ok(r)) {
      XM.MessageController.set("loadingStatus", "_failedSession".loc());
      s.sendEvent("interrupted");
      s.gotoState("LOGGEDOUT");
      this.invokeLater(function() { s.invokeStateMethod("reset"); }, 100);
      return;
    }
    // var b = r.get("body"), u = b.username, sid = b.sid;
    // if(u !== this.get("_username"))
    //   this.error("The retrieved session was for a different user", YES);
    // if(!sid)
    //   this.error("The server did not supply a valid session id", YES);
    // this._session_id = sid;
    this.set("isActive", YES);
    s.sendEvent(XM.SESSION_ACQUIRED); 
  },

  /** @private */
  destroy: function() {
    arguments.callee.base.apply(this, arguments);
    this._cookie.destroy();
  },

  //.................................................
  // Observers
  //

  _usernameDidChange: function() {
    this.log(this.get("_username"));
  }.observes("_username"),
  
  _passwordDidChange: function() {
    this.log(this.get("_password"));
  }.observes("_password"),

  _shouldEnableLogin: function() {
    var u = this.get("_username"),
        p = this.get("_password"),
        a = this.get("_serverIsAvailable");
    if (!u || !p || u.length <= 0 || p.length <= 0 || !a) {
      if(this.get("loginIsEnabled") === NO) return;
      else this.set("loginIsEnabled", NO);
    }
    else if(this.get("loginIsEnabled") === YES) return;
    else this.set("loginIsEnabled", YES);
  }.observes("_username", "_password", "_serverIsAvailable"),

  //.................................................
  // Private Properties
  //

  /** @private */
  _cookie: null,

  /** @private */
  _username: null,

  /** @private */
  _password: null,

  /** @private */
  _session_id: null,

  /** @private */
  _serverIsAvailableBinding: "XM.DataSource.serverIsAvailable",

  //.................................................
  // Calculated Properties
  //

  /** @property
    Returns the current session cookie if possible.
  */
  cookie: function() {
    var c = this.get("_cookie");
    if(!c || SC.none(c) || !c.isCookie) return NO;
    return c;
  }.property()

}) ;
