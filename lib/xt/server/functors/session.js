
/** @class
*/
xt.requestSession = xt.functor.create(
  /** @lends xt.requestSession.prototype */ {

  handle: function(xtr) {
    var p = xtr.get('json');
    if(xt.none(p) || xt.none(p.username) || xt.none(p.password)) return issue(xt.close("Missing information in session request", xtr)); 
    this.validateUser(p.username, p.password, xtr); 
  },

  validateUser: function(u, p, xtr) {

    var query = "";

    // here we don't have a session so we are going
    // to call the database query method directly
    // xt.db.query(

  },

  /** @property */
  handles: 'requestSession',

  /** @private */
  className: 'xt.requestSession' 

});

