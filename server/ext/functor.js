/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _path = XT.path;
  
  XT.Functor = XT.Object.extend({

    init: function () {
      var handles = this.get("handles");
      if (XT.typeOf(handles) !== XT.T_ARRAY) handles = [handles];
      XT.functors.push({handles: handles, target: this});
      _.each(handles, function (handle) {
        XT.functorMap[handle] = this;
      }, this);
    },
  
    handle: function (payload, session) {},
  
    handles: null,

    className: "XT.Functor"
  });
  
  XT.run(function () {
    var path, files;
    
    if (!XT.functorsDirectory) return;
    
    path = _path.join(XT.basePath, XT.functorsDirectory);
    
    XT.functors = [];
    XT.functorMap = {};
    
    XT.log("Loading available functors from %@".f(
      XT.shorten(path, 5)));
    
    files = XT.directoryFiles(path, {extension: ".js", fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });
}());
