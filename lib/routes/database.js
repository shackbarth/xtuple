/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  var _ = X._, ObjectId = X.mongoose.Types.ObjectId;
  
  require("../ext/administrative_route");
  
  X.databaseRoute = X.AdministrativeRoute.create({
    clientModel: "database",
    model: function () {
      return X.proxyCache.model("DatabaseServer");
    }.property()
  });
  
  //X.databaseRoute = X.AdministrativeRoute.create({
  //  update: function (xtr, id) {
  //    X.debug("database: my update handler was called: %@, %@".f(xtr.get("path"), id));
  //    X.debug(xtr.get("data"));
  //    xtr.close();
  //  },
  //  delete: function (xtr, id) {
  //    X.debug("database: my delete handler was called: %@, %@".f(xtr.get("path"), id));
  //    xtr.close();
  //  },
  //  new: function (xtr) {
  //    X.debug("database: my new handler was called: %@".f(xtr.get("path")));
  //    xtr.close();
  //  },
  //  clientModel: "database",
  //  model: function () {
  //    return X.proxyCache.model("DatabaseServer");
  //  }.property()
  //});
  
  
  //X.databaseRoute = X.Route.create({
  //  handle: function (xtr) {
  //    //X.debug("handle(route, database): ", xtr.get("payload"), xtr.get("data"));
  //    var K = this.get("model"), path = xtr.get("path");
  //    
  //    switch(path) {
  //      case "/lookup/databases":
  //        K.find({}, _.bind(this.foundAll, this, xtr));
  //        break;
  //      case "/lookup/database":  
  //        K.findOne(xtr.get("payload"), _.bind(this.found, this, xtr));
  //        break;
  //      case "/save/database":
  //        this.save(xtr);
  //        break;
  //      case "/delete/database":
  //        this.deleteEntry(xtr);
  //        break;
  //    }
  //  },
  //  found: function (xtr, err, res) {
  //    if (err || !res) return xtr.error(err? err: "could not find");
  //    xtr.write(res.toObject()).close();
  //  },
  //  foundAll: function (xtr, err, res) {
  //    if (err || !res) return xtr.error(err? err: "none found");
  //    xtr.write(res).close();
  //  },
  //  save: function (xtr) {
  //    var data = xtr.get("payload"), K = this.get("model"), k, query;
  //    // order of events, try to find one like it, if its found, try to
  //    // update it, if not found, create a whole new entry, if that fails
  //    // ...i dunno...
  //    
  //    if (!data || _.keys(data).length === 0) return xtr.error({isError: true, reason: "invalid data"});
  //    
  //    query = K.findOne({});
  //    query.or([{name: data.name}, {hostname:data.hostname}]);
  //    
  //    query.exec(function (err, res) {
  //      if (err || !res) {
  //        if (err) return xtr.error({isError: true, reason: err? err: "unknown error"});
  //        k = new K(data);
  //        k.save(function (err) {
  //          if (err) xtr.error({isError: true, reason: err? err: "unknown error during save"});
  //          else xtr.write({success: true}).close();
  //        })
  //        return;
  //      } else {
  //        var keys = _.keys(res.toObject());
  //        _.each(keys, function (key) {
  //          if (data[key] && data[key] !== res[key]) res[key] = data[key];
  //        });
  //        res.save(function (err) {
  //          if (err) xtr.error({isError: true, reason: err? err: "unknown error during update"});
  //          else xtr.write({success: true}).close();
  //        });
  //      }
  //    });
  //  },
  //  deleteEntry: function (xtr) {
  //    var data = xtr.get("payload"), K = this.get("model"), query;
  //    
  //    if (!data || _.keys(data).length === 0) return xtr.error({isError: true, reason: "invalid data"});
  //    
  //    query = K.remove({});
  //    query.or([{name: data.name}, {hostname: data.hostname}]);
  //    query.exec(function (err) {
  //      if (err) {
  //        return xtr.error({isError: true, reason: err? err: "unknown error during delete"});
  //      } else xtr.write({success: true}).close();
  //    })
  //  },
  //  model: function () {
  //    return X.proxyCache.model("DatabaseServer");
  //  }.property(),
  //  handles: "/lookup/database /lookup/databases /save/database /delete/database".w()
  //});
  
}());
