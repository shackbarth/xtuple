/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    handle: function (xtr, session, callback) {
      var query, payload;

      payload = xtr.get("data");
      query = "select xt.fetch('%@')".f(payload);

      xtr.debug("fetch(): %@".f(query));

      session.query(query, function (err, res) {
        if (err) {
          xtr.error({data: err});
          if (callback) {callback(err, null);}
        } else {
          xtr.write({data: res}).close();
          if (callback) {callback(null, res)};
        }
      });
    },

    handles: "function/fetch",

    needsSession: true

  });
}());
