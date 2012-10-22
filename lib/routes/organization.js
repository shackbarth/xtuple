/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  var _ = X._;
  
  require("../ext/administrative_route");  
  
  X.organizationRoute = X.AdministrativeRoute.create({
    clientModel: "organization",
    model: function () {
      return X.proxyCache.model("Organization");
    }.property()
  });
  
  
  //X.organizationRoute = X.Route.create({
  //  handle: function (xtr) {
  //    //X.debug("handle(route, organization): ", xtr.get("payload"), xtr.get("data"));
  //    var K = this.get("model"), path = xtr.get("path");
  //    
  //    switch(path) {
  //      case "/lookup/organizations":
  //        K.find({}, _.bind(this.foundAll, this, xtr));
  //        break;
  //      case "/lookup/organization":  
  //        K.findOne(xtr.get("payload"), _.bind(this.found, this, xtr));
  //        break;
  //      case "/save/organization":
  //        this.save(xtr);
  //        break;
  //      case "/delete/organization":
  //        this.deleteEntry(xtr);
  //        break;
  //    }
  //  },
  //  found: function (xtr, err, res) {
  //    if (err || !res) return xtr.error(err? err: "not found");
  //    xtr.write(res.toObject()).close();
  //  },
  //  foundAll: function (xtr, err, res) {
  //    if (err || !res) return xtr.error(err? err: "none found");
  //    xtr.write(res).close();
  //  },
  //  save: function (xtr) {
  //    var data = xtr.get("payload"), K = this.get("model"), k;
  //    // order of events, try to find one like it, if its found, try to
  //    // update it, if not found, create a whole new entry, if that fails
  //    // ...i dunno...
  //    
  //    if (!data || _.keys(data).length === 0) return xtr.error({isError: true, reason: "invalid data"});
  //    
  //    K.findOne({name: data.name}, function (err, res) {
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
  //    var data = xtr.get("payload"), K = this.get("model");
  //    
  //    if (!data || _.keys(data).length === 0) return xtr.error({isError: true, reason: "invalid data"});
  //    
  //    K.remove({name: data.name}, function (err) {
  //      if (err) {
  //        return xtr.error({isError: true, reason: err? err: "unknown error during delete"});
  //      } else xtr.write({success: true}).close();
  //    })
  //  },
  //  model: function () {
  //    return X.proxyCache.model("Organization");
  //  }.property(),
  //  handles: "/lookup/organization /lookup/organizations /save/organization /delete/organization".w()
  //});
  
}());
