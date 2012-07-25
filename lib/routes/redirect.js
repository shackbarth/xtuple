/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.redirectRoute = XT.Route.create({
    handle: function (xtr) {
      var res = xtr.get("response");
      res.writeHead(302, {Location: "https://%@%@".f(xtr.get("host"), xtr.get("url"))});
      res.end();
    },
    handles: "*".w()
  });
}());