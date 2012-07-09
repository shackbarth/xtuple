/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  var _path = XT.path, flag, path, module;
  
  if ((flag = process.argv.indexOf('-c')) > 0) {
    path = _path.join(XT.basePath, process.argv[flag + 1]);
  } else {
    path = _path.join(XT.basePath, "lib", "config.js");
  }
  
  XT.opts = require(path);
  
  for (module in XT.opts) {
    if (!XT.opts.hasOwnProperty(module)) continue;
    if (!XT[module]) continue;
    XT.mixin(XT[module], XT.opts[module]);
  }
}());