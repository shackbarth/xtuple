/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  require("../ext/administrative_route");

  X.datasourceRoute = X.Route.create({
    handle: function (xtr) {
      var method = xtr.get("method"),
        data = xtr.get("json");
      if (method === "POST") {
        if (data.lookup) {
          delete data.lookup;
          this.lookup(xtr, data);
        }
      } else if (method === "GET") {
        this.fetch.apply(this, arguments);
      } else {
        X.warn("could not handle datasource related request, %@, %@".f(method, xtr.get("path")));
        xtr.close();
      }
    },
    fetch: function (xtr, id) {
      //X.debug("fetch: ", id);
      if (id) {
        X.warn("what am I supposed to do with that? '%@'".f(id));
        xtr.close();
      } else {
        if (!X.activeServices) {
          xtr.error({isError: true, reason: "Invalid request."});
          return;
        }
        var d = X.activeServices.get("datasources");
        //X.debug("datasources: ", _.values(d));
        xtr.write(_.values(d)).close();
      }
    },
    lookup: function (xtr, data) {
      X.debug("lookup: ", data);
    },
    handles: "/datasource /datasources /datasource/:id".w(),
    className: "X.datasourceRoute"
  });

  //X.datasourceRoute = X.AdministrativeRoute.create({
  //  clientModel: "datasource",
  //  model: function () {
  //    return X.proxyCache.model("Datasource");
  //  }.property()
  //});

  //X.datasourceRoute = X.AdministrativeRoute.create({
  //  update: function (xtr, id) {
  //    X.debug("datasource: my update handler was called: %@, %@".f(xtr.get("path"), id));
  //    X.debug(xtr.get("data"));
  //    xtr.close();
  //  },
  //  delete: function (xtr, id) {
  //    X.debug("datasource: my delete handler was called: %@, %@".f(xtr.get("path"), id));
  //    xtr.close();
  //  },
  //  new: function (xtr) {
  //    X.debug("datasource: my new handler was called: %@".f(xtr.get("path")));
  //    xtr.close();
  //  },
  //  clientModel: "datasource",
  //  model: function () {
  //    return X.proxyCache.model("Datasource");
  //  }.property()
  //});

  //X.datasourceRoute = X.Route.create({
  //  handle: function (xtr) {
  //    //X.debug("handle(route, datasource): ", xtr.get("payload"), xtr.get("data"));
  //    var K = this.get("model");
  //    K.findOne(xtr.get("payload"), _.bind(this.found, this, xtr));
  //  },
  //  found: function (xtr, err, res) {
  //    if (err || !res) return xtr.error(err? err: "could not find");
  //    xtr.write(res.toObject()).close();
  //  },
  //  model: function () {
  //    return X.proxyCache.model("Datasource");
  //  }.property(),
  //  handles: "/lookup/datasource".w()
  //});

}());
