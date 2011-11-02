
/*globals XT */

sc_require("statecharts/session_statechart");

/** @namespace

*/

XT.SESSION_COOKIE_STRING = "XTUPLEACTIVESESSIONCOOKIE";

XT.Session = XT.Object.create(XT.SessionStatechart,
  /** @scope XT.Session.prototype */ {
  
  /** @property */
  name: "XT.Session",

  start: function() {
    this.log("Starting up");
    var cookie = this.get("cookie");
    if(!cookie) this.sendEvent("loggedOut");
    
    // no logged in case yet

    return YES;
  },

  /** @property */
  isActive: NO,

  /** @private */
  _cookie: null,

  /** @private */
  _username: null,

  /** @private */
  _password: null,

  /** @private */
  _session_id: null,

  cookie: function() {
    var c = SC.Cookie.find(XT.SESSION_COOKIE_STRING);
    if(!c || SC.none(c)) return NO;
  }.property().cacheable(),

}) ;
