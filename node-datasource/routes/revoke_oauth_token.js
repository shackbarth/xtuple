/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true, SYS:true */

(function () {
  "use strict";

  var async = require("async");

  // https://localhost/dev/oauth/revoke-token?token=id123
  /**
    Revoke an OAUTH2 token.
   The token can be an access token or a refresh token.
   If the token is an access token and it has a corresponding refresh token,
   the refresh token will also be revoked.
   */
  exports.revokeToken = function (req, res) {
    var token = req.query.token,
      coll = new SYS.Oauth2tokenCollection();

    coll.fetch({
      query: {
        parameters: [{
          attribute: ["refreshToken", "accessToken"],
          operator: "MATCHES",
          value: token
        }]
      },
      username: req.session.passport.user.username,
      database: req.session.passport.user.organization,
      success: function (coll, result) {
        var deleteModel = function (model, callback) {
          model.destroy({
            success: function () {
              callback();
            },
            error: function (err) {
              callback(err);
            }
          });
        };

        async.each(coll.models, deleteModel, function (err) {
          if (err) {
            res.send({isError: true, error: err});
            return;
          }
          res.send({message: "Token revoked."});

        });

      },
      error: function (err) {
        res.send({isError: true, error: err});
      }
    });
  };
}());
