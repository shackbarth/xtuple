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
       .f(req.session.passport.user.username),
      org = req.session.passport.user.organization,
      queryOptions = XT.dataSource.getAdminCredentials(org),
      dataObj;

    XT.dataSource.query(sql, queryOptions, function (err, results) {
      if (err) {
        res.send({isError: true, message: err.message});
        return;
      }
      var data = results.rows[0].post;
      if (req.query.debug) {
        // let them get their strings from the client if in debug mode
        dataObj = JSON.parse(data);
        dataObj.strings = [];
        data = JSON.stringify(dataObj);
      }
      res.set('Content-Type', 'text/javascript');
      res.send("XT = typeof XT !== 'undefined' ? XT : {};\nXT.locale = " + data);
    });
  };
}());
