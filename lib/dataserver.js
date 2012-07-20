/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.dataServer = XT.Server.create({
    name: "dataServer",
    port: XT.options.datasource.port,
    autoStart: true,
    router: XT.dataRouter,
    useWebSocket: true,
    init: function () {
      // strict mode...
      this._super.init.apply(this, arguments);
      this.setSocketHandler("/client", "connection", _.bind(this.initSocket, this));
    },
    initSocket: function (socket) {
      var map = XT.functorMap, handle, handler, func;
      for (handle in map) {
        if (!map.hasOwnProperty(handle)) continue;
        handler = map[handle];
        func = _.bind(handler.handle, handler);
        socket.on(handle, _.bind(this.handleSocketRequest, this, handle, socket, func, handler));
      }
    },
    handleSocketRequest: function (path, socket, callback, handler, payload, ack) {
      var xtr = XT.Response.create({
        path: path,
        socket: socket,
        data: payload,
        ack: ack
      });
      if (handler.needsSession) callback(xtr, XT.Session.create(payload));
      else callback(xtr);
    }
  });
}());