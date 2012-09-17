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

    // https://localtest.com/export?requestType=fetch&query={%22recordType%22:%22XM.Locale%22}
    handle: function (xtr) {
      var path, handler, session;
      var url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        requestType = querystring.parse(args).requestType,
        query = querystring.parse(args).query;


      xtr.data = '{"requestType":"%@","query":%@}'.f(requestType, query);

      session = X.Session.create(xtr.get("data"));
      session.once("isReady", _.bind(this.ready, this, session, xtr));
      session.once("error", _.bind(this.error, this, session, xtr));
    },

    ready: function (session, xtr) {
      X.log("ready(): ");
      session.removeAllListeners("isReady");


      var path, handler, session;
      var url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        requestType = querystring.parse(args).requestType,
        query = querystring.parse(args).query;


      xtr.data = '{"requestType":"%@","query":%@}'.f(requestType, query);

      path = "function/" + xtr.get("requestType"); // XXX function/ seems to be necessary here
      handler = this.find(path);

      //var response = xtr.get("response");
      //response.writeHead(200, {"Content-Type": "text/csv"});
      //response.write("1,2,3,4,5,6,7,8,9,0");
      //response.end();
      //return;


      if (!handler) {
        xtr.error("Could not handle %@".f(path));
      } else {
        handler.handle(xtr, session);
      }


      // ugly much?
      xtr.write({code: 1, data: session.get("details")}).close();
    },

    error: function (session, xtr) {
      X.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error({isError: true, reason: session.get("error")});
    },

    find: function (path) {
      var ret = X.functorMap[path];
      //console.log("find(): ", Object.keys(X.functorMap));
      return ret;
    },

    handles: "export /export".w()
  });
}());
