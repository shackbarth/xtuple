(function () {

  var _path = X.path, _ = X._;

  enyo = {
    relativePath: "",
    depends: function () {
      var root = this.relativePath, files = X.$A(arguments);
console.log("##### Files from xvows_init lines 472+ #####\r");
console.log(files + "\r");
      _.each(files, function (file) {
        require(_path.join(root, file));
console.log(root + "/" + file + "\r");
      });
console.log("##### The path is not correct for CRM package.js files, so they get dupped #####\r");
console.log("##### and now we hang sometime after this loop.... #####\r");
    },
    getCookie: function () {
      return X.json(XVOWS.details);
    }
  };
}());