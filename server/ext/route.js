/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";
  
  var _ = X._, _path = X.path;
  
  X.Route = X.Object.extend({
    init: function () {
      var handles = this.handles, regex, tmp = [];
      regex = /(:[a-z0-9]*)/g;
      _.each(handles, function (handle, idx) {
        var match = handle.match(regex), base, route;
        if (match) {
          base = handle.replace(regex, "([a-z0-9]*)").suf("$");
          base = base.escape();
          tmp.push(new RegExp(base));
        }
      });
      if (tmp.length > 0) handles = handles.concat(tmp);
      this.handles = handles;
    },
    handle: function (xtr) {},
    handles: []
  });
  
  X.run(function () {
    var path, files;

    if (!X.routesDirectory) return;
    
    path = _path.join(X.basePath, X.routesDirectory);

    X.log("Loading available routes from %@".f(
      X.shorten(path, 5)));
    
    files = X.directoryFiles(path, {extension: ".js", fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });
  
}());
