/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    We've stored report data in a temporary table with a key. Return the data to anyone who has the
    appropriate key.

    @extends X.Route
    @class
   */
  X.dataFromKeyRoute = X.Route.create({

    handle: function (xtr) {
      // this is all very temporary
      var that = this,
        querystring = require("querystring"),
        url = xtr.request.url,
        response = xtr.get("response"),
        params = url.substring(url.indexOf('?') + 1),
        dataKey = -1,
        tempDataModel;

      if (params) {
        dataKey = querystring.parse(params).dataKey;
      }

      //console.log(XT.session.schema.attributes);
      //tempDataModel = new XM.BiCache({key: dataKey});
      tempDataModel = XM.BiCache.findOrCreate(dataKey);
      if (tempDataModel === null) {
        // this bit should not be necessary by my understanding of findOrCreate. Go figure.
        tempDataModel = new XM.BiCache({key: dataKey});
      }

      tempDataModel.fetch({success: function (model, result) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify({
          data: JSON.parse(model.get("data")),
          query: JSON.parse(model.get("query"))}));
        response.end();

        // this message will self-destruct in 1 second...
        // TODO: makes more sense to sweep out old records. We'll have
        // to do that anyway.
        //model.destroy({
        //  success: function () {
        //    console.log("destroy success")
        //  },
        //  error: function () {
        //    console.log("destroy error")
        //  }
        //});
      }, error: function (model, err) {
        console.log("error", model);
        if (err.code === 'xt1007') {
          xtr.error({isError: true, message: "Record not found"});
        } else {
          xtr.error({isError: true, message: "Error"});
        }
      }});
    },

    handles: "dataFromKey /dataFromKey".w()
  });
}());
