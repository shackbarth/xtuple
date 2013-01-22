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
        dataString = '[{"id": 32,"isActive": true,"name": "Admin Admin","firstName": "Admin","lastName": "Admin","jobTitle": "Admin"}]',
        data = JSON.parse(dataString),
        queryString = '{"orderBy":[{"attribute": "lastName"},{"attribute": "firstName"}],"parameters": [{"attribute": "isActive","operator": "=","value": true}],"recordType": "XM.ContactListItem"}',
        query = JSON.parse(queryString);

      if (params) {
        dataKey = querystring.parse(params).dataKey;
      }

      // TODO: actually fetch real data from the temporary table
      response.writeHead(200, {"Content-Type": "application/json"});
      response.write(JSON.stringify({data: data, query: query}));
      response.end();
    },

    handles: "dataFromKey /dataFromKey".w()
  });
}());
