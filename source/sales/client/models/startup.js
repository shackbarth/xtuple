/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initStartup = function () {
    XT.StartupTasks.push({
      taskName: "loadCustomerTypes",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.customerTypes = new XM.CustomerTypeCollection();
        XM.customerTypes.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadSalesReps",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.salesReps = new XM.SalesRepCollection();
        XM.salesReps.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadTaxZones",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.taxZones = new XM.TaxZoneCollection();
        XM.taxZones.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadShipVias",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.shipVias = new XM.ShipViaCollection();
        XM.shipVias.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadShipCharges",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.shipCharges = new XM.ShipChargeCollection();
        XM.shipCharges.fetch(options);
      }
    });
    XT.StartupTasks.push({
      taskName: "loadShipZones",
      task: function () {
        var options = {
          success: _.bind(this.didComplete, this)
        };
        XM.shipZones = new XM.ShipZoneCollection();
        XM.shipZones.fetch(options);
      }
    });
  };

}());