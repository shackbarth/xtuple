/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    Redirect to https keeping the same url otherwise
   */
  exports.redirect = function (req, res) {
    res.redirect("https://" + req.header('host') + req.route.path);
  };

}());
