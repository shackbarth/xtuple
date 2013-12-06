/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initStartup = function () {
    XT.cacheCollection("XM.purchaseEmailProfiles", "XM.PurchaseEmailProfileCollection", "name");
    XT.cacheCollection("XM.purchaseTypes", "XM.PurchaseTypeCollection", "code");
  };

}());
