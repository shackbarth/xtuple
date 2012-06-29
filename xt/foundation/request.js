// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  /**
  */
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
          notify(_.extend(Object.create(XT.Response), response));
        };
      }

      // attach the session details to the payload
      payload = _.extend(payload, details);

      XT.log("Socket sending: %@".replace("%@", handle), payload);

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
