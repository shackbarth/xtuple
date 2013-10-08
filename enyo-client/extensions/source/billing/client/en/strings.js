/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {

  // ********
  // Labels
  // ********

    "_billing": "Billing",
    "_billingDescription": "Corporate Relationship Management",
    "_salesCategory": "Sales Category",
    "_salesCategories": "Sales Categories",
    "_maintainSalesCategory": "Maintain Sales Category"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());