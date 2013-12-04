_ = require('underscore');
moment = require('moment');

_.mixin(require('congruence'));

// TODO move this mixin to a separate util module
_.mixin({
  compactObject: function(o) {
    _.each(o, function(v, k){
      if(!v) {
        delete o[k];
      }
    });
    return o;
  }
});

module.exports = {
  RestQuery: require('./rest_query'),
  XtGetQuery: require('./xtget_query')
};
