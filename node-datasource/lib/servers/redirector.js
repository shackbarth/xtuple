/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _path = X.path;

  require(_path.join(X.basePath, "lib/routes/redirector"));

  X.Server.create({
    name: "Redirector",
    autoStart: true,
    port: 800,
    router: X.Router.create({
      routes: [X.redirectRoute]
    })
  });

}());
