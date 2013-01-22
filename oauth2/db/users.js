var users = [
    { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
    { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' }
];

/*
exports.find = function (id, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id.id) {
      return done(null, user);
    }
  }
  return done(null, null);
};
*/

/*
  Beware that we don't actually verify the password here. We
  just pull the user by username. Password verification gets
  done in passport.js.

  Note also that I'm assuming all users are off their
  old MD5 passwords by now.
*/
exports.findByUsername = function (username, done) {
  var user = new XM.User(),
    options = {};

  options.success = function (res) {
    done(null, res);
  };

  options.error = function (res, err) {
    if (err.code === 'xt1007') {
      // XXX should "result not found" really be an error?
      done(null, false);
    } else {
      X.log("Error authenticating user", arguments);
      done(err);
    }
  }

  // the user id we're searching for
  options.id = username;

  // the user under whose authority the query is run
  options.username = X.options.globalDatabase.nodeUsername;

  user.fetch(options);
};
