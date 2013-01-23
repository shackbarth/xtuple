/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _url = require("url");

  /**
    General purpose response object can deal with WebSockets or HTTP
    and abstracts the details.

    @class
    @extends X.Object
    @see X.HTTPResponse
    @see X.SocketResponse
   */
  X.Response = X.Object.extend({
    init: function () {
      if (this.socket) {
        X.mixin(this, X.SocketResponse);
      } else {
        X.mixin(this, X.HTTPResponse);
      }
      this.initMixin();
    }
  });

  /**
    Implementation of X.Reponse for HTTP requests

    @class
    @see X.Response
   */
  X.HTTPResponse = {

    isReady: false,
    isClosed: false,
    isDestroyed: false,
    data: "",
    code: 200,
    payload: null,

    initMixin: function () {
      var req, chunk, didChunk;
      chunk = _.bind(this.chunk, this);
      didChunk = _.bind(this.didChunk, this);
      req = this.get("request");
      req.on("data", chunk);
      req.on("end", didChunk);
    },

    debug: function (message) {
      X.debug("HTTPResponse debugging: %@".f(message));
    },

    chunk: function (chunk) {
      this.data += chunk;
    },

    didChunk: function () {
      if (X.typeOf(this.data) === X.T_STRING) this.payload = X.json(this.data);
      else this.payload = this.data;
      this.set("isReady", true);
    },

    requestType: function () {
      return this.get("json").requestType;
    }.property(),

    json: function () {
      var data = this.get("data");
      return data ? X.json(data) : {requestType:"NO REQUEST TYPE"};
    }.property(),

    destroy: function () {
      this.close();
      delete this.request;
      delete this.response;
      this.removeAllListeners();
      this.set("isDestroyed", true);
    },

    error: function (message) {
      this.set("code", 400);
      this.write(message).close();
      this.destroy();
    },

    method: function () {
      return this.get("request").method;
    }.property(),

    close: function () {
      if (this.isDestroyed || this.isClosed) return this;
      this.get("response").end();
      this.set("isClosed", true);
    },

    /**
      Returns the URL of the request

      @method X.Response.path
     */
    path: function () {
      return _url.parse(this.get("request").url).pathname;
    }.property(),

    url: function () {
      return this.get("request").url;
    }.property(),

    host: function () {
      return this.get("request").headers.host;
    }.property(),

    write: function () {
      var res = this.get("response"),
          args = X.$A(arguments), i = 0;
      for (; i < args.length; ++i) {
        if (X.typeOf(args[i]) !== X.T_STRING) {
          args[i] = X.json(args[i]);
        }
        //X.debug("writing: ", X.typeOf(args[i]), " ", args[i]);
        res.write(args[i]);
      }
      return this;
    },

    codeDidChange: function () {
      X.debug("codeDidChange(): ");
      var res = this.get("response"), code = this.get("code");
      res.statusCode = code;
    }.observes("code")

  };

  /**
    Implementation of X.Reponse for socket requests

    @class
    @see X.Response
   */
  X.SocketResponse = {

    useSocket: true,
    payload: null,
    store: {},

    initMixin: function () {
      this.payload = this.data;
      this.data = this.data.payload;

      if (X.typeOf(this.data) === X.T_HASH)
        this.data = X.json(this.data);

      this.store = {};
    },

    requestType: function () {
      return this.get("path");
    }.property(),

    debug: function (message) {
      if (!X.debugging) return;
      this.get("socket").emit("debug", {message: message});
    },

    write: function (chunk) {
      X.mixin(this.store, chunk);
      return this;
    },

    url: function () {
      return this.get("request").url;
    }.property(),

    close: function () {
      this.ack(this.store);
      return this;
    },

    error: function (err) {
      //X.warn("X.Response.error(): ", err);
      this.write(X.mixin(err, {isError: true})).close();
      this.destroy();
    },

    destroy: function () {
      if (this.isDestroyed) return this;
      this.removeAllListeners();
      delete this.socket;
      delete this.ack;
      this.set("isDestroyed", true);
    }

  };


}());
