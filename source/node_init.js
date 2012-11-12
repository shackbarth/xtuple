//var X = X || {};

//X.relativeDependsPath = "";
//X.depends = function () {
//  var root = this.relativeDependsPath,
//    files = X.$A(arguments);

//  _.each(files, function (file) {
//    require(_path.join(root, file));
//  });
//};

require("./core.js");
require("./model.js");
require("./collection.js");
require("./document.js");
require("./info.js");
require("./comment.js");
require("./characteristic.js");
require("./alarm.js");
require("./settings.js");
