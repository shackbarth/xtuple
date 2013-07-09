/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

(function () {
  "use strict";

  /**
    Fetches and sends the client code of the requested UUID
   */
  exports.clientCode = function (req, res) {
    var model = new SYS.ClientCode();

    model.fetch({
      id: req.query.uuid,
      username: X.options.databaseServer.user,
      database: req.session.passport.user.organization,
      success: function (result, model) {
        if (req.query.language === 'css') {
          res.set('Content-Type', 'text/css');
        } else {
          res.set('Content-Type', 'application/javascript');
        }
        res.setHeader("Cache-Control", "public, max-age=86400000");
        res.send(model.get("code"));
      },
      error: function (err) {
        res.send({isError: true, error: err});
      }
    });
  };
}());
