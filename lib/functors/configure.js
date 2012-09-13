/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    handle: function (xtr, session, callback) {
      var payload = xtr.get("data"),
        payloadObject = JSON.parse(payload),
        parameters = payloadObject.parameters,
        username = session.get("details").id,
        oldPassword = parameters.oldPassword,
        newPassword = parameters.newPassword,
        http = require("http"),
        config = require("../../config"),
        chunk,
        body = "";

      var options = {
        host: config.proxy.hostname,
        port: config.proxy.port,
        path: '/changePassword',
        method: 'POST'
      };

      http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          console.log('BODY: ' + body);
        });
      }).end();

    },


      //xtr.debug("configure(): %@".f(query));

      //session.query(query, function (err, res) {
      //  if (err) {
      //    xtr.error({data: err});
      //    if (callback) {callback(err, null);}
      //  } else {
      //    xtr.write({data: res}).close();
      //    if (callback) {callback(null, res)};
      //  }
      //});


    handles: "function/configure",

    needsSession: true

  });
}());
