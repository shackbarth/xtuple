/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global it:true, XT:true, XM:true, XV:true, exports:true, require:true, setTimeout:true */

(function () {
  "use strict";

  var _     = require("underscore"),
      toSql = function (mqlString, params) {
        var result = _.clone(mqlString);
        _.each(params, function (value, key) {
          var valueRE = new RegExp("<\\? *value\\(['\"]"   + key + "['\"]\\) *\\?>", "g"),
            literalRE = new RegExp("<\\? *literal\\(['\"]" + key + "['\"]\\) *\\?>", "g");
          if (_.isNumber(value)) {
            result = result.replace(valueRE, value);
          } else {
            result = result.replace(valueRE, "'" + value + "'");
          }
          result = result.replace(literalRE, value);
        });
        return result;
      };

  exports.toSql = toSql;

}());
