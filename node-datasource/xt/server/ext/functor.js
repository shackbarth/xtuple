/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._, _path = X.path;

  /**
    Functor

    @class
    @extends X.Object
  */
  X.Functor = X.Object.extend(/** @lends X.Functor */{

    /**
      Initializes functor from handles
    */
    init: function () {
      var handles = this.get("handles");
      if (X.typeOf(handles) !== X.T_ARRAY) handles = [handles];
      X.functors.push({handles: handles, target: this});
      _.each(handles, function (handle) {
        X.functorMap[handle] = this;
      }, this);
    },

    handle: function (payload, session) {},

    handles: null,

    className: "X.Functor"
  });

  X.run(function () {
    var path, files;

    if (!X.functorsDirectory) return;

    path = _path.join(X.basePath, X.functorsDirectory);

    X.functors = [];
    X.functorMap = {};

    X.log("Loading functors from %@".f(
      X.shorten(path, 3)));

    files = X.directoryFiles(path, {extension: ".js", fullPath: true});
    _.each(files, function (file) {
      require(file);
    });
  });
}());
