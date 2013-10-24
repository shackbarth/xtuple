/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
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

      readOnlyAttributes: [
        "AllowAvgCostMethod",
        "AllowStdCostMethod",
        "AllowJobCostMethod"
      ],

      bindEvents: function () {
        XM.Settings.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      statusDidChange: function () {
        var that = this,
          options = {
            success: function (used) {
              that.setReadOnly("AllowAvgCostMethod", used.average);
              that.setReadOnly("AllowStdCostMethod", used.standard);
              that.setReadOnly("AllowJobCostMethod", used.job);
            }
          };
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.dispatch("XM.Inventory", "usedCostMethods", null, options);
        }
      },

      validate: function () {
        var error = XM.Settings.prototype.validate.apply(this, arguments);
        if (error) { return error; }

        if (!this.get("AllowAvgCostMethod") &&
            !this.get("AllowStdCostMethod") &&
            !this.get("AllowJobCostMethod")) {
          // TO DO: Throw must have at least one cost method error
        }
      }

    });

    XM.inventory = new XM.Inventory();

  };

}());
