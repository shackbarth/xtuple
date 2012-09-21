(function () {

  var _path = X.path, _ = X._;

  enyo = {
    relativePath: "",
    depends: function () {
      var root = this.relativePath, files = X.$A(arguments);
      _.each(files, function (file) {
        require(_path.join(root, file));
      });
    },
    getCookie: function () {
      return X.json(XVOWS.details);
    }
  };
}());