/**
 * Module dependencies.
 */
var passport = require('passport')
  , login = require('connect-ensure-login')


exports.index = function (req, res) {
  res.send('OAuth 2.0 Server');
};

exports.loginForm = function (req, res) {
  res.render('login');
};

exports.scopeForm = function (req, res) {
  var organizations = ['dev', 'dev2'];
  // TODO something like this should work once the plumbing works:
  //var organizations = _.map(req.user.get("organizations").toJSON(), function (org) {return org.name;});

  // TODO it would be nice to choose an org automatically if there's only one.
  /*
  it would look something like this maybe
  if (organizations.length === 1) {
    exports.scope(req, res);
  }
  */
  res.render('scope', { organizations: organizations });
};

exports.login = passport.authenticate('local', { successReturnToOrRedirect: '/scope', failureRedirect: '/' });

exports.logout = function (req, res) {
  // TODO - delete the db session.
  req.logout();
  res.redirect('/');
}

exports.scope = function (req, res) {
  // TODO: verify that the org is valid for the user
  res.redirect('/client');
}


exports.account = [
  //login.ensureLoggedIn({redirectTo: "/logout"}),

  login.ensureLoggedIn(),
  function (req, res) {
    res.render('account', { user: req.user });
  }
]
