/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  /**
    Defines the data route.

    @extends X.Route
    @class
   */
  X.exportRoute = X.Route.create({

    handle: function (xtr) {
      var path, handler, session;

      var url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        cacheId = querystring.parse(args).cacheId,
        response = xtr.get("response"),
        cachedCsv;

      if (!X.csvCache) {
        // this shouldn't happen
        return;
      }
      cachedCsv = X.csvCache[cacheId].csv;

      response.writeHead(200, {"Content-Type": "text/csv"});
      response.write(cachedCsv);
      response.end();

    },
    /*
    // https://localtest.com/export?requestType=fetch&query={%22recordType%22:%22XM.Locale%22}
    handle: function (xtr) {
      var path, handler, session;

      var url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        requestType = querystring.parse(args).requestType,
        query = querystring.parse(args).query;

      console.log(xtr.get("data"));
      xtr.data = '{"requestType":"%@","query":%@}'.f(requestType, query);
      console.log(xtr.get("data"));

      path = "function/" + xtr.get("requestType"); // XXX function/ seems to be necessary here
      handler = this.find(path);

      var response = xtr.get("response");
      response.writeHead(200, {"Content-Type": "text/csv"});
      response.write('"1","2","3","4","5","6","7","8","9","0"');
      response.end();
      return;


      //if (!handler) {
      //  xtr.error("Could not handle %@".f(path));
      //} else {
      //  if (handler.needsSession) {
      //    session = X.Session.create(xtr.get("payload"));
      //  }
      //  handler.handle(xtr, session);
      //}

    },
*/
    find: function (path) {
      var ret = X.functorMap[path];
      //console.log("find(): ", Object.keys(X.functorMap));
      return ret;
    },

    handles: "export /export".w()
  });
}());
