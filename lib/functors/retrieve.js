/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    handle: function (xtr, session) {
      var query, payload;

      payload = JSON.parse(xtr.get("data"));
      payload.username = session.get("username");
      payload = JSON.stringify(payload);
      query = "select xt.retrieve_record('%@')".f(payload);

      xtr.debug("retrieveRecord(): %@".f(query));

      session.query(query, function (err, res) {
        if (err) {
          xtr.error({data: err});
        } else {
          xtr.write({data: res}).close();
        }
      });
    },

    handles: "function/retrieveRecord",

    needsSession: true
  });
}());
