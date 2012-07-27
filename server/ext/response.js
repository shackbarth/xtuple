/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _url = require("url");
  
  XT.Response = XT.Object.extend({
    init: function () {
      if (this.socket) {
        XT.mixin(this, XT.SocketResponse);
      } else {
        XT.mixin(this, XT.HTTPResponse);
      }
      this.initMixin();
    }
  });
  
  XT.HTTPResponse = {
    
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
      XT.debug("HTTPResponse debugging: %@".f(message));
    },

    chunk: function (chunk) {
      this.data += chunk;
    },
    
    didChunk: function () {
      if (XT.typeOf(this.data) === XT.T_STRING) this.payload = XT.json(this.data);
      else this.payload = this.data;
      this.set("isReady", true);
    },
    
    requestType: function () {
      return this.get("json").requestType;
    }.property(),
    
    json: function () {
      var data = this.get("data");
      return data ? XT.json(data) : {requestType:"NO REQUEST TYPE"};
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
    
    close: function () {
      if (this.isDestroyed || this.isClosed) return this;
      this.get("response").end();
      this.set("isClosed", true);
    },
    
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
          args = XT.$A(arguments), i = 0;
      for (; i < args.length; ++i) {
        if (XT.typeOf(args[i]) !== XT.T_STRING) {
          args[i] = XT.json(args[i]);
        }
        res.write(args[i]);
      }
      return this;
    },
    
    codeDidChange: function () {
      XT.debug("codeDidChange(): ");
      var res = this.get("response"), code = this.get("code");
      res.statusCode = code;
    }.observes("code")
    
  };
  
  XT.SocketResponse = {
    
    useSocket: true,
    payload: null,
    store: {},
    
    initMixin: function () {
      this.payload = this.data;
      this.data = this.data.payload;
      
      if (XT.typeOf(this.data) === XT.T_HASH)
        this.data = XT.json(this.data);
        
      this.store = {};
    },
    
    requestType: function () {
      return this.get("path");
    }.property(),
    
    debug: function (message) {
      this.get("socket").emit("debug", {message: message});
    },
    
    write: function (chunk) {
      XT.mixin(this.store, chunk);
      return this;
    },
    
    url: function () {
      return this.get("request").url;
    }.property(),
    
    close: function () {
      this.ack(this.store);
      return this;
    },
    
    error: function (message) {
      //XT.warn("XT.Response.error(): ", message);
      this.write({reason: message, isError: true}).close();
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