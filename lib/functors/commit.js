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

      // XXX begin hack

      // we need to convert js binary into pg hex (see the file route for
      // the opposite conversion). We should probably have a dedicated
      // route for the operation of saving an XM.File.
      try {
        if (payload.indexOf('"recordType":"XM.File"') >= 0 ||
            payload.indexOf('"recordType":"XM.Image"') >= 0) {
          var payloadObj = xtr.get('payload').payload;
          var data = payloadObj.dataHash.data;
          var buffer = new Buffer(data, "binary"); // XXX uhoh: binary is deprecated but necessary here
          data = '\\x' + buffer.toString("hex");
          payloadObj.dataHash.data = data;
          payload = JSON.stringify(payloadObj);
        }
      } catch (error) {

      }
      // XXX end hack

      query = "select xt.commit_record($$%@$$)".f(payload);

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
