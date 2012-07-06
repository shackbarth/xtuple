/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  require('./xt');
  require('./runtime/opts');

  XT.mode = XT.opts.datasource.mode || 'development';
  XT.debugging = !! XT.opts.datasource.debugging;
  XT.cache = XT.Cache.create();
  
  require('./runtime/dataserver');

}());