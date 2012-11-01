/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  X.Functor.create({

    handle: function (xtr, session) {
      var query,
        payload = JSON.parse(xtr.get("data")),
        binaryField = payload.binaryField,
        binaryData,
        buffer,
        payloadString;

      payload.username = session.get("username");
      payloadString = JSON.stringify(payload);

      // we need to convert js binary into pg hex (see the file route for
      // the opposite conversion). see issue 18661
      if (binaryField) {
        binaryData = payload.dataHash[binaryField];
        buffer = new Buffer(binaryData, "binary"); // XXX uhoh: binary is deprecated but necessary here
        binaryData = '\\x' + buffer.toString("hex");
        payload.dataHash[binaryField] = binaryData;
        payloadString = JSON.stringify(payload);
      }

      query = "select xt.commit_record($$%@$$)".f(payloadString);

      xtr.debug("commitRecord(): %@".f(query));

      session.query(query, function (err, res) {
        if (err) xtr.error({data: err});
        else xtr.write({data: res}).close();
      });
    },

    handles: "function/commitRecord",

    needsSession: true
  });
}());
