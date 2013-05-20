/**
  Define our own authentication criteria for passport. Passport itself defines
  its authentication function here:
  https://github.com/jaredhanson/passport/blob/master/lib/passport/http/request.js#L74
  We are stomping on that method with our own special business logic.
  The ensureLoggedIn function will not need to be changed, because that calls this.
 */
exports.isAuthenticated = function () {
  "use strict";

  var creds = this.session.passport.user;

  if (creds && creds.id && creds.username && creds.organization) {
    return true;
  } else {
    destroySession(this.sessionID, this.session);
    return false;
  }
};
