/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  XT.Request = {
    /** @scope XT.Request.prototype */

    send: function (data) {
      var details = XT.session.details,
        sock = XT.dataSource._sock,
        notify = this._notify,
        handle = this._handle,
        payload = {
          payload: data
        },
        callback;

      if (!notify || !(notify instanceof Function)) {
        callback = XT.K;
      } else {
        callback = function (response) {
          //notify(_.extend(Object.create(XT.Response), response));
          if (response && response.isError) {
            XT.log("Response error ", response);
          }
          notify(new XT.Response(response));
        };
      }

      // attach the session details to the payload
      payload = _.extend(payload, details);

      if (XT.debugging) {
        XT.log("Socket sending: %@".replace("%@", handle), payload);
      }

      sock.json.emit(handle, payload, callback);

      return this;
    },

    handle: function (event) {
      this._handle = event;
      return this;
    },

    notify: function (method) {
      var args = Array.prototype.slice.call(arguments).slice(1);
      this._notify = function (response) {
        args.unshift(response);
        method.apply(null, args);
      };
      return this;
    }

  };

}());
