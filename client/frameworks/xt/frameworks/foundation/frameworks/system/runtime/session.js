
/*globals XT */

sc_require("statecharts/session_statechart");

/** @namespace

*/

XT.SESSION_COOKIE_STRING = "XTUPLEACTIVESESSIONCOOKIE";
XT.SESSION_COOKIE_EXPIRE = 10;
XT.SESSION_COOKIE_SECURE = YES;

XT.Session = XT.Object.create(
  /** @scope XT.Session.prototype */ {
  
  /** @property */
  name: "XT.Session",

  /** @property */
  isActive: NO,

  /** @property */
  statechart: XT.SessionStatechart.create(),

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

    // initialize the statechart to help coordinate particular
    // events and prohibit unintended actions from being permitted
    this.statechart.set("owner", this).initStatechart();

    // attempt to grab a session cookie, will return false if
    // no cookie exists
    var c = this.get("cookie");
    if(!c || SC.none(c)) c = this._newCookie(); 

    // if at this point we don't have a valid cookie for any reason
    // we have to fail the app :(
    if(!c || SC.none(c) || !c.isCookie)
      this.error(
        "Could not generate the necessary session cookie. Perhaps secure " +
        "cookies are disabled or unsupported by the server?", YES
      );

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
      name: XT.SESSION_COOKIE_STRING,
      secure: XT.SESSION_COOKIE_SECURE,
      expires: SC.DateTime.create().advance({
        minute: XT.SESSION_COOKIE_EXPIRE }),
    });
    if(!SC.none(c) && c.isCookie === YES)
      this._cookie = c;
    return c;
  },

  /** @private */
  _validateSession: function() {

    // @todo As of 11/3/2011 the datasource was not set up to
    //  handle sessions yet so this is hacked to compensate
    //  temporarily

    var v = this._cookie.value,
        s = this.statechart;
    if(!v || SC.none(v) || !v.sid) 
      return s.sendEvent("noSession");
    else return s.sendEvent("tryToLogin");
    
  },

  /** @private */
  _login: function() {
    if(this.get("isActive") === YES)
      this.error("Attempt to login after already logged in", YES);
    var self = this; 

    // since there server cannot yet do this we must pretend
    setTimeout(function() {
      self.statechart.sendEvent("success"); 
    }, 2000);
  },

  /** @private */
  _acquireSessionId: function() {
    return YES;
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
        p = this.get("_password");
    if(!u || !p || u.length <= 0 || p.length <= 0)
      if(this.get("loginIsEnabled") === NO) return;
      else this.set("loginIsEnabled", NO);
    else if(this.get("loginIsEnabled") === YES) return;
    else this.set("loginIsEnabled", YES);
  }.observes("_username", "_password"),

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

  //.................................................
  // Calculated Properties
  //

  /** @property
    Returns the current session cookie if possible.
  */
  cookie: function() {
    var c = this._cookie || SC.Cookie.find(XT.SESSION_COOKIE_STRING);
    if(!c || SC.none(c) || !c.isCookie) return NO;
  }.property().cacheable(),

}) ;
