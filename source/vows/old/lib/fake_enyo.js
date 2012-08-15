
//......................................
// JUST CAN'T BELIEVE HOW ATTROCIOUS THIS
// REALLY IS BUT WHATEVER...ONLY WORKS FOR
// INCLUSION OF THE MODELS FOR NOW
enyo = XT.enyo = {
  depends: function() {
    var models = XT.$A(arguments);
    models.filter(function(file) {
      return _path.extname(file) === ".js"? true: false;
    }).map(function(file) {
      return _path.join(__dirname, "..", "../xm/models", file);
    }).forEach(function(path) {
      require(path);
    });
  }
};
