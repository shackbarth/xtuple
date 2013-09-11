/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.inventory.initShipmentModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.Shipment = XM.Document.extend({

      recordType: "XM.Shipment",

      numberPolicy: XM.Document.AUTO_NUMBER

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShipShipment = XM.Model.extend({

      recordType: "XM.ShipShipment",

      readOnlyAttributes: [
        "number",
        "order"
      ],

      save: function (key, value, options) {
        var that = this,
          options = {},
          params = [
            this.id,
            this.get("shipDate")
          ];
        options.success = function (resp) {
          var map,
            err;
          // Check for silent errors
          if (resp < 0) {
            map = {
              "-1": "xtinv1001",
              "-5": "xtinv1002",
              "-8": "xtinv1008",
              "-12": "xtinv1003",
              "-13": "xtinv1004",
              "-15": "xtinv1005",
              "-50": "xtinv1006",
              "-99": "xtinv1007"
            }
            resp = resp + "";
            err = XT.Error.clone(map[resp] ? map[resp] : "xt1001");
            that.trigger("invalid", that, err, options || {});
          } else {
            that.fetch();
          }
        }
        this.dispatch("XM.Inventory", "shipShipment", params, options);
        return this;
      }

    });

    /** @private */
    var _canDo = function (priv, callback) {
      var ret = XT.session.privileges.get(priv);
      if (callback) {
        callback(ret);
      }
      return ret;
    };

    /**
      @class

      @extends XM.Model
    */
    XM.ShipmentSalesOrder = XM.Model.extend({

      recordType: "XM.ShipmentSalesOrder"

    });

    /**
      @class

      @extends XM.Document
    */
    XM.ShipmentLine = XM.Document.extend({

      recordType: "XM.ShipmentLine",

      parentKey: "shipment"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ShipmentListItem = XM.Info.extend({

      recordType: "XM.ShipmentListItem",

      editableModel: "XM.Shipment",

      canRecallShipment: function (callback) {
        var isShipped = this.get("isShipped"),
          isInvoiced = this.get("isInvoiced"),
          isInvoicePosted = this.get("isInvoicePosted"),
          priv = isShipped && isInvoiced && !isInvoicePosted ?
            "RecallInvoicedShipment" : isShipped && !isInvoiced ? "RecallOrders" : false;
        return _canDo.call(this, priv, callback);
      },

      doRecallShipment: function (callback) {
        var that = this,
          options = {},
          params = [this.id];
        options.success = function (resp) {
          var fetchOpts = {};
          fetchOpts.success = function () {
            if (callback) { callback(resp); }
          };
          if (resp) {
            that.fetch(fetchOpts);
          }
        };
        options.error = function (resp) {
          if (callback) { callback(resp); }
        };
        this.dispatch("XM.Inventory", method, params, options);
        return this;
      }

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ShipmentRelation = XM.Info.extend({

      recordType: "XM.ShipmentRelation",

      editableModel: "XM.Shipment"

    });


    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentCollection = XM.Collection.extend({

      model: XM.Shipment

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentListItemCollection = XM.Collection.extend({

      model: XM.ShipmentListItem

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentRelationCollection = XM.Collection.extend({

      model: XM.ShipmentRelation

    });

  };

}());

