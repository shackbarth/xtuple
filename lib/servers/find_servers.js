(function () {
  var _ = X._, root = __dirname, files;
  files = X.directoryFiles(root, {extension: ".js", fullPath: true});
  _.each(files, function (file) { 
    return file.indexOf(__filename) !== -1? null: require(file);
  });
}());