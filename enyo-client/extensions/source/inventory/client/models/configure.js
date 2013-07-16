/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Inventory = XM.Settings.extend(/** @lends XM.Inventory.Settings.prototype */ {

      recordType: 'XM.Inventory',

      privileges: 'ConfigureIM',

      validate: function (attributes, options) {
        // XXX not sure if number widgets can fail in this way.
        var params = { type: "_number".loc() };
        if (attributes.NextShipmentNumber !== undefined &&
            isNaN(attributes.NextShipmentNumber)) {
          params.attr = "_shipment".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        } 
      } 
    });

    XM.inventory = new XM.Inventory();

  };

}());
