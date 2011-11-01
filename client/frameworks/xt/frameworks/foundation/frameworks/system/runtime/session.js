
/*globals XT */

sc_require("statecharts/session_statechart");

/** @namespace

*/
XT.Session = XT.Object.create(XT.SessionStatechart,
  /** @scope XT.Session.prototype */ {
  
  /** @property */
  name: "XT.Session",

  start: function() {
    this.log("Starting up");
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

}) ;
