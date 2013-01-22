/**
 * Module dependencies.
 */
var passport = require('passport')
  , login = require('connect-ensure-login')


exports.index = function(req, res) {
  res.send('OAuth 2.0 Server');
};

exports.loginForm = function(req, res) {
  res.render('login');
};

exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/client', failureRedirect: '/' });

exports.logout = function(req, res) {
  // Delete the db session.
  req.session.passport = null;
  res.clearCookie('connect.sid');
  req.session.destroy(function() {});

  req.logout();
  res.redirect('/');
}

exports.account = [
  //login.ensureLoggedIn({redirectTo: "/logout"}),

  login.ensureLoggedIn(),
  function(req, res) {
    res.render('account', { user: req.user });
  }
]
