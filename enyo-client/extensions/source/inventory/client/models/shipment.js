/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.inventory.initShipmentModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.Shipment = XM.Document.extend({

      recordType: "XM.Shipment",

      numberPolicy: XM.Document.AUTO_NUMBER,

      readOnlyAttributes: [
        "isShipped",
        "order"
      ],

      statusDidChange: function () {
        XM.Document.prototype.statusDidChange.apply(this, arguments);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          if (this.get("isShipped")) {
            this.setReadOnly("shipDate");
          }
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShipShipment = XM.Model.extend({

      recordType: "XM.ShipShipment",

      readOnlyAttributes: [
        "number",
        "order",
        "value"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      /**
        This overload will first save any changes via usual means, then
        call `shipShipment`.
      */
      save: function (key, value, options) {
        var that = this,
          success;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        success = options.success;

        // Ship shipment after successful save
        options.success = function (model, resp, options) {
          var shipOptions = {},
            shipDate = XT.date.applyTimezoneOffset(that.get("shipDate"), true),
            params = [
              that.id,
              shipDate
            ];
          shipOptions.success = function (shipResp) {
            if (success) { success(model, resp, options); }
          };
          shipOptions.error = function () {
            // The datasource takes care of reporting the error to the user
          };
          that.dispatch("XM.Inventory", "shipShipment", params, shipOptions);
          return this;
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        XM.Model.prototype.save.call(this, key, value, options);
      },

      statusDidChange: function () {
        var K = XM.Model;
        // We want to be able to save and ship immeditately.
        if (this.getStatus() === K.READY_CLEAN) {
          this.setStatus(K.READY_DIRTY);
        }
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShipShipmentLine = XM.Model.extend({

      recordType: "XM.ShipShipmentLine",

      parentKey: "shipment"

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

      recordType: "XM.ShipmentSalesOrder",

      formatShipto: function () {
        return XM.Address.format(
          this.get('shiptoName'),
          this.get('shiptoAddress1'),
          this.get('shiptoAddress2'),
          this.get('shiptoAddress3'),
          this.get('shiptoCity'),
          this.get('shiptoState'),
          this.get('shiptoPostalcode'),
          this.get('shiptoCountry')
        ) || "";
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ShipmentLine = XM.Model.extend({

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

      canShipShipment: function (callback) {
        var isNotShipped = !this.get("isShipped"),
          priv = isNotShipped ? "ShipOrders" : false;
        return _canDo.call(this, priv, callback);
      },

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
        this.dispatch("XM.Inventory", "recallShipment", params, options);
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

    /**
      @class

      @extends XM.Collection
    */
    XM.ShipmentSalesOrderCollection = XM.Collection.extend({

      model: XM.ShipmentSalesOrder

    });


  };

}());

