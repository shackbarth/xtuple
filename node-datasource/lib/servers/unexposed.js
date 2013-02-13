/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _path = X.path;

  require(_path.join(X.basePath, "lib/routes/maintenance"));

  X.Server.create({
    name: "Unexposed",
    autoStart: true,
    port: 449,
    // XXX not sure this is sufficient to deny any requests coming from outside
    bindAddress: "localhost",
    router: X.Router.create({
      routes: [X.maintenanceRoute]
    })
  });

}());
