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

      tempDataModel = new XM.PentahoTempQueryData({key: dataKey});
      tempDataModel.fetch({success: function (model, result) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify({data: model.get("data"), query: model.get("query")}));
        response.end();
      }, error: function (model, err) {
        if (err.code === 'xt1007') {
          xtr.error({isError: true, message: "Record not found"});
        } else {
          xtr.error({isError: true, message: "Error"});
        }
      }});


      // TODO: delete old temp rows based on timestamp
    },

    handles: "dataFromKey /dataFromKey".w()
  });
}());
