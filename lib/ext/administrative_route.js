/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XM:true */

(function () {
  "use strict";

  //var _ = X._;

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
      Looks up a single record based on specified query.

      @param {X.Reponse} xtr
      @param {Object} data
     */
    lookup: function (xtr, data) {
      var Model = this.get("model"),
        Klass = XM.Collection.extend({model: Model}),
        coll = new Klass({model: Model}),
        query = { parameters: [] },
        param = {},
        options = {},
        prop;
      for (prop in data) {
        if (data.hasOwnProperty(prop)) {
          param.attribute = prop;
          param.value = data[prop];
          query.parameters.push(param);
        }
      }
      options.query = query;
      options.success = function (res) {
        xtr.write(res.models[0].toJSON()).close();
      };
      options.error = function (model, err) {
        xtr.error({isError: true, reason: err.message()});
      };
      // make this request with the authority of the node user
      options.username = X.options.globalDatabase.nodeUsername;
      coll.fetch(options);
    },

    className: "X.AdministrativeRoute"
  });

}());
