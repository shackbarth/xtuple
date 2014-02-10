/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    Redirect to https keeping the same url otherwise
   */
  exports.redirect = function (req, res) {
    var host = req.header('host');
    if (host.indexOf(':') >= 0) {
      // strip off the port number from the host name
      host = host.substring(0, host.indexOf(':'));
    }

    var redirectPort = X.options.datasource.proxyPort || X.options.datasource.port;

    if (redirectPort  === 443) {
      res.redirect("https://" + host + req.url);
    } else {
      res.redirect("https://" + host + ":" + redirectPort + req.url);
    }
  };

}());
