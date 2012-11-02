/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _fs = X.fs, _path = X.path, _util = X.util;

  /**
    Administrative route

    @class
    @extends X.Route
   */
  X.AdministrativeRoute = X.Route.extend(/** @lends X.AdministrativeRoute */{
    /**
      The name of the model that this route will operate on.

      @type {String}
     */
    clientModel: "",

    /**
      Init. Sets this route to handle /%@ and other paths you get when you hold
      down the shift key and start typing.
     */
    init: function () {
      var model = this.get("clientModel"), handles = [];
      handles.push("/%@/:id".f(model));
      handles.push("/%@s".f(model));
      handles.push("/%@".f(model));
      this.set("handles", handles);
      this._super.init.call(this);
    },
    /**
      Sends requests to the appropriate function

      @param {X.Reponse} xtr
     */
    handle: function (xtr) {
      var method = xtr.get("method"), data = xtr.get("json");
      //X.debug("X.AdministrativeRoute.handle(): ", method);
      if (method === "PUT") this.update.apply(this, arguments);
      else if (method === "DELETE") this.delete.apply(this, arguments);
      else if (method === "POST") {
        //X.debug("METHOD POST: ", data);
        if (data.lookup) {
          delete data.lookup;
          this.lookup(xtr, data);
        } else this.new.apply(this, arguments);
      } else this.fetch.apply(this, arguments);
    },

    /**
      Fetches a mongo model by ID.

      @param {X.Reponse} xtr
      @param {Number} id
     */
    fetch: function (xtr, id) {
      var model = this.get("model"), data;
      if (id) model.find({_id: id}, _.bind(this.didFind, this, xtr));
      else model.find({}, _.bind(this.didFind, this, xtr));
    },

    /**
      Looks up a single mongo model based on specified query.

      @param {X.Reponse} xtr
      @param {Object} data The specified query in Mongoosish
     */
    lookup: function (xtr, data) {
      var K = this.get("model");
      K.findOne(data, function (err, res) {
        if (err || !res) return xtr.error({isError: true, reason: err});
        xtr.write(res).close();
      });
    },

    /**
      Updates a model based on data in xtr.get("json");

      @param {X.Response} xtr
      @param {Number} id The id to update
     */
    update: function (xtr, id) {
      var K = this.get("model"), data = xtr.get("json");
      K.findById(id, function (err, k) {
        if (err) return xtr.error({isError: true, reason: err});
        delete data._id;
        _.each(data, function (value, key) {
          k[key] = value;
        });
        k.save(function (err) {
          if (err) return xtr.error({isError: true, reason: err});
          xtr.close();
        })
      });
    },

    /**
      Deletes the ID passed in

      @param {X.Response} xtr
      @param {Number} id The ID to delete
     */
    delete: function (xtr, id) {
      var K = this.get("model");
      K.remove({_id: id}, function (err) {
        if (err) return xtr.error({isError: true, reason: err});
        xtr.close();
      });
    },

    /**
      Creates a new model based on data in xtr.get("json")

      @param {X.Response} xtr
     */
    new: function (xtr) {
      var K = this.get("model"), k;
      k = new K(xtr.get("json"));
      k.save(function (err) {
        if (err) X.warn(err);
        if (err) return xtr.error({isError: true, reason: err});
        xtr.close();
      });
    },
    didFind: function (xtr, err, res) {
      if (err || !res) {
        return xtr.error({isError: true, reason: err? err.message: "unknown failure"});
      }
      //X.debug("X.AdministrativeRoute.didFind(): ", X.typeOf(res), res);
      xtr.write(res).close();
    },
    className: "X.AdministrativeRoute"
  });

}());
