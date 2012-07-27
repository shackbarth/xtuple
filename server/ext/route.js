/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _ = XT._, _path = XT.path;
  
  XT.Route = XT.Object.extend({
    handle: function (xtr) {},
    handles: []
  });
  
  XT.run(function () {
    var path, files;

    if (!XT.routesDirectory) return;
    
    path = _path.join(XT.basePath, XT.routesDirectory);

    XT.log("Loading available routes from %@".f(
      XT.shorten(path, 5)));
    
    files = XT.directoryFiles(path, {extension: ".js", fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });
  
}());
