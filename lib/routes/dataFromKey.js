/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    Defines the route which is a proxy for our Pentaho reporting server

    @extends X.Route
    @class
   */
  X.dataFromKeyRoute = X.Route.create({
    getRequestDetails: function (originalUrl) {
      console.log(originalUrl);
      var url = require("url"),
        args = url.parse(originalUrl).query;

      return querystring.parse(args).details;
    },

    handle: function (xtr) {
      console.log(xtr.request.url);
      var that = this,
        querystring = require("querystring"),
        url = xtr.request.url,
        params = url.substring(url.indexOf('?') + 1),
        dataKey = -1,
        data = {
          "id": 7
        };

      if (params) {
        dataKey = querystring.parse(params).dataKey;
      }

      // TODO: actually fetch real data from the temporary table
      xtr.write({data: data}).close();
    },

    handles: "dataFromKey /dataFromKey".w()
  });
}());
