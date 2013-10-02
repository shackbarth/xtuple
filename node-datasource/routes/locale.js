/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, SYS:true, XT:true, _:true */

(function () {
  "use strict";

  /**
   Fetches (via a dispatch function) user locale and string translation data
   */
  exports.locale = function (req, res) {
    var sql = 'select xt.post($${"nameSpace":"XT","type":"Session",' +
     '"dispatch":{"functionName":"locale","parameters":null},"username":"%@"}$$)'
     .f(req.session.passport.user.username);

    var org = req.session.passport.user.organization;
    var queryOptions = XT.dataSource.getAdminCredentials(org);
    XT.dataSource.query(sql, queryOptions, function (err, results) {
      var data = results.rows[0].post;
      res.send("var locale = " + data);
    });

  };
}());
