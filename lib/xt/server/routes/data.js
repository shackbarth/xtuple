/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._;
  
  XT.dataRoute = XT.Route.create({

    handle: function(xtr) {
      var path, handler, session;
      
      path = xtr.get("requestType");
      handler = this.find(path);
      
      if (!handler) {
        xtr.error("Could not handle %@".f(path));
      } else {
        if (handler.needsSession) session = XT.Session.create(xtr.get("data"));
        handler.handle(xtr, session);
      }
    },
  
    find: function(path) {
      var ret = XT.functorMap[path];
      console.log("find(): ", Object.keys(XT.functorMap));
      return ret;
    },

    handles: "data /data".w()
  
  });
  
  XT.run(function() {
    XT.log("%@ functors were found and loaded for data route".f(XT.functors.length)); 
  });
}());