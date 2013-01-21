/**
 * Module dependencies.
 */
var passport = require('passport')
  , login = require('connect-ensure-login')


exports.index = function (req, res) {
  res.send('OAuth 2.0 Server');
};




exports.account = [
  //login.ensureLoggedIn({redirectTo: "/logout"}),

  login.ensureLoggedIn(),
  function (req, res) {
    res.render('account', { user: req.user });
  }
]
