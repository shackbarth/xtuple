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

    //
    // CLASS FUNCTIONS
    //
    _.extend(XM.Inventory, {

      canIssueStock: function (callback) {
        var canDo = true; // TODO ??? //XT.session.privileges.get("EnterReceipts");
        callback(canDo);
        return canDo;
      },

      canEnterReceipt: function (callback) {
        var canDo = XT.session.privileges.get("EnterReceipts");
        callback(canDo);
        return canDo;
      },

      issueStock: function () {
        // TODO
      },

      /**
        @param {Array} lineItemsDetail
        @param {String} lineItemsDetail[n].uuid
        @param {Number} lineItemsDetail[n].quantity
       */
      enterReceipt: function (lineItemsDetail, callback) {
        var options = {
            error: callback,
            success: function (resp) {
              if (callback) {
                callback(null, resp);
              }
            }
          },
          payload = {
            nameSpace: "XM",
            type: "Inventory",
            dispatch: {
              functionName: "enterReceipt",
              parameters: [lineItemsDetail]
            }
          };

        XT.dataSource.request(null, "post", payload, options);
      }

    });


    XM.inventory = new XM.Inventory();

  };

}());
