/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
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
          if (response && response.isError) {
            // handle error status centrally here

            XT.log("Response error1 ", response);
            XT.log("Response error2 ", response.status.message);
            XT.log("Response error3 ", response.message);
            if (response.code === "SESSION_NOT_FOUND") {
              // The session couldn't be validated by the datasource.
              // XXX might be dead code
              XT.logout();
            }

          }

          notify(response);
        };
      }

      // attach the session details to the payload
      payload = _.extend(payload, details);

      if (XT.session.config.debugging) {
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
