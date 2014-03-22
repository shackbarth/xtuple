/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true,
noarg:true, regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true, moment:true */

_ = require('underscore');
moment = require('moment');

_.mixin(require('congruence'));

// TODO move this mixin to a separate util module
_.mixin({
  compactObject: function (o) {
    "use strict";

    _.each(o, function (v, k) {
      if (!v) {
        delete o[k];
      }
    });
    return o;
  }
});

module.exports = {
  RestQuery: require('./rest_query'),
  FreeTextQuery: require('./freetext_query'),
  XtGetQuery: require('./xtget_query')
};
