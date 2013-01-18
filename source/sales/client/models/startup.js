/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initStartup = function () {
    XT.StartupTasks.push({
      taskName: "loadStuff",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.salesReps = new XM.SalesRepCollection();
        XM.salesReps.fetch(options);
        XM.taxZones = new XM.TaxZoneCollection();
        XM.taxZones.fetch(options);
        XM.shipVias = new XM.ShipViaCollection();
        XM.shipVias.fetch(options);
        XM.shipCharges = new XM.ShipChargeCollection();
        XM.shipCharges.fetch(options);
        XM.shipZones = new XM.ShipZoneCollection();
        XM.shipZones.fetch(options);
      }
    });
  };

//add TaxZone, ShipVia, ShippingForm, ShippingCharges

}());