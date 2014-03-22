/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSiteModels = function () {

    XM.ItemSite.prototype.augment({
      defaults: function () {
        return {isPurchased: false};
      }
    });

  };


}());

