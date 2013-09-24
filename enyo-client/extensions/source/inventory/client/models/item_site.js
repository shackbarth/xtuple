/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemSiteModels = function () {

    var _proto = XM.ItemSite.prototype,
      _defaults = _proto.defaults,
      _bindEvents = _proto.bindEvents,
      _initialize = _proto.initialize,
      _statusDidChange = _proto.statusDidChange;

    _proto.readOnlyAttributes = (_proto.readOnlyAttributes || []).concat([
        'receiveLocation',
        'isReceiveLocationAuto',
        'stockLocation',
        'isStockLocationAuto',
        'maximumOrderQuantity',
        'minimumOrderQuantity',
        'multipleOrderQuantity',
        'orderToQuantity',
        'reorderLevel',
        'supplySite',
        'userDefinedLocation',
        'useParametersManual'
      ]);

    var ext = {
      /**
        An array of cost methods allowed for this item site.
      */
      costMethods: null,

      defaults: function () {
        var defaults = _defaults.apply(this, arguments);
        defaults = _.extend(defaults, {
          abcClass: "A",
          isAutomaticAbcClassUpdates: false,
          cycleCountFrequency: 0,
          isStocked: false,
          safetyStock: 0,
          useParameters: false,
          useParametersManual: false,
          reorderLevel: 0,
          orderToQuantity: 0,
          minimumOrderQuantity: 0,
          multipleOrderQuantity: 0,
          maximumOrderQuantity: 0,
          isLocationControl: false,
          isReceiveLocationAuto: false,
          isIssueLocationAuto: false
        });
        return defaults;
      },

      bindEvents: function () {
        _bindEvents.apply(this, arguments);
        this.on('change:controlMethod change:item', this.controlMethodDidChange);
        this.on('change:costMethod', this.costMethodDidChange);
        this.on('change:item', this.itemDidChange);
        this.on('change:isLocationControl change:useDefaultLocation',
          this.useDefaultLocationDidChange);
      },

      controlMethodDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          controlMethod = this.get("controlMethod"),
          costMethod = this.get("costMethod"),
          item = this.get("item"),
          itemType = item ? item.get("itemType") : false,
          settings = XT.session.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod"),
          quantityOnHand = this.get("quantityOnHand");

        /* Set default cost method */
        if (controlMethod === K.NO_CONTROL ||
            itemType === I.REFERENCE ||
            itemType ===  I.KIT) {
          this.set("costMethod", K.NO_COST);
          this.setReadOnly("costMethod");
          this.costMethods = [K.NO_COST];
        } else {
          if (allowStd &&
              costMethod !== K.AVERAGE_COST &&
              costMethod !== K.JOB_COST) {
            this.set("costMethod", K.STANDARD_COST);
          } else if (allowAvg &&
              costMethod !== K.STANDARD_COST &&
              costMethod !== K.JOB_COST) {
            this.set("costMethod", K.AVERAGE_COST);
          } else if (allowJob &&
              costMethod !== K.AVERAGE_COST &&
              costMethod !== K.STANDARD_COST) {
            this.set("costMethod", K.JOB_COST);
          }

          // Cost available cost methods
          this.costMethods = _.without(this.costMethods, K.NO_COST);
          if (!_.contains(this.costMethods, K.STANDARD_COST) &&
              allowStd) {
            this.costMethods.push(K.STANDARD_COST);
          }
          if (!_.contains(this.costMethods, K.AVERAGE_COST) &&
              allowAvg) {
            this.costMethods.push(K.AVERAGE_COST);
          }
        }

        // Determine if Job Cost is possible
        if ((itemType === I.MANUFACTURED ||
            itemType === I.PURCHASED ||
            itemType === I.OUTSIDE_PROCESS) &&
          controlMethod !== K.NO_CONTROL &&
          allowJob &&
          quantityOnHand) {
          if (!_.contains(this.costMethods, K.JOB_COST)) {
            this.costMethods.push(K.JOB_COST);
          }
        } else {
          this.costMethods = _.without(this.costMethods, K.JOB_COST);
        }

        if (costMethod === K.JOB_COST) {
          this.costMethodDidChange();
        }
      },

      costMethodDidChange: function () {
        var K = XM.ItemSite,
          costMethod = this.get("costMethod"),
          item = this.get("item");
        if (!item) { return; }
        if (costMethod === K.JOB_COST) {
          this.setReadOnly([
            "safetyStock",
            "abcClass",
            "isAutomaticAbcClassUpdates",
            "cycleCountFrequency",
            "useParameters",
            "isSold",
            "isLocationControl",
            "restrictedLocationsAllowed"
          ]);
          this.setReadOnly("useDefaultLocation", false);

          this.set({
            isStocked: false,
            safetyStock: 0,
            abcClass: false,
            isAutomaticAbcClassUpdates: false,
            cycleCountFrequency: 0,
            useParameters: false,
            isSold: false,
            isLocationControl: false,
            useDefaultLocation: false
          });
        } else {
          this.itemDidChange();
        }
      },

      initialize: function () {
        _initialize.apply(this, arguments);
        var K = XM.ItemSite,
          settings = XT.session.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod");

        // Determine which cost types are allowed
        this.costMethods = [K.NO_COST];
        if (allowStd) {
          this.costMethods.push(K.STANDARD_COST);
        }
        if (allowAvg) {
          this.costMethods.push(K.AVERAGE_COST);
        }
        if (allowJob) {
          this.costMethods.push(K.JOB_COST);
        }
      },

      itemDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          item = this.get("item"),
          itemType = item ? item.get("item") : false,
          controlMethod = this.get("controlMethod"),
          costMethod = this.get("costMethod"),
          settings = XT.session.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod"),
          nonStockTypes = [
            I.REFERENCE,
            I.PLANNING,
            I.BREEDER,
            I.BY_PRODUCT,
            I.CO_PRODUCT
          ],
          attrs;

        if (!itemType) { return; }

        // Set a default cost method based on item type
        if (controlMethod === K.NO_CONTROL ||
            itemType === I.REFERENCE || itemType === I.KIT) {
          this.set("costMethod", K.NO_COST);
          this.setReadOnly("costMethod", true);
          this.costMethods = _.without(this.costMethods,
            K.STANDARD_COST, K.AVERAGE_COST, K.JOB_COST);
        } else {
          if (allowStd && costMethod !== K.STANDARD_COST) {
            this.set("costMethod", K.STANDARD_COST);
          } else {
            this.set("costMethod", K.AVERAGE_COST);
          }
          this.costMethods = _.without(this.costMethods, K.NO_COST);

          if (allowStd && !_.contains(this.costMethods, K.STANDARD_COST)) {
            this.costMethods.push(K.STANDARD_COST);
          }
          if (allowAvg && !_.contains(this.costMethods, K.AVERAGE_COST)) {
            this.costMethods.push(K.AVERAGE_COST);
          }
          if (allowJob && !_.contains(this.costMethods, K.JOB_COST)) {
            this.costMethods.push(K.JOB_COST);
          }
        }

        // Settings dependent on whether inventory item or not
        if (_.contains(nonStockTypes, itemType)) {
          this.setReadOnly([
            "safetyStock",
            "abcClass",
            "isAutomaticAbcClassUpdates",
            "cycleCountFrequency",
            "isStocked",
            "useDefaultLocation",
            "isLocationControl",
            "controlMethod"
          ]);

          attrs = {
            isStocked: false,
            useDefaultLocation: false,
            isLocationControl: false
          };

          if (itemType === I.REFERENCE || itemType === I.KIT) {
            this.setReadOny("isSold", false);
            attrs.controlMethod = K.NO_CONTROL;
          } else {
            this.set("isSold", false);
            this.setReadOny("isSold");
            attrs.controlMethod = K.REGULAR_CONTROL;
          }
  
          this.set(attrs);
        } else {
          this.setReadOnly([
            "safetyStock",
            "abcClass",
            "isAutomaticAbcClassUpdates",
            "cycleCountFrequency",
            "leadTime",
            "isSold",
            "isStocked",
            "useDefaultLocation",
            "isLocationControl",
            "controlMethod"
          ], false);
        }
      },

      statusDidChange: function () {
        _statusDidChange.apply(this, arguments);
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.controlMethodDidChange();
          this.useDefaultLocationDidChange();
        }
      },

      useDefaultLocationDidChange: function () {
        var useDefault = this.get("useDefaultLocation"),
          isLocationControl = this.get("isLocationControl");
        this.setReadOnly([
          "receiveLocation",
          "isReceiveLocationAuto",
          "stockLocation",
          "isStockLocationAuto"
        ], !isLocationControl || !useDefault);
        this.setReadOnly("userDefinedLocation", isLocationControl || !useDefault);
      }
    };

    XM.ItemSite = XM.ItemSite.extend(ext);
    /**
      @class

      @extends XM.Model
    */
    XM.ItemSiteLocation = XM.Model.extend({

      recordType: "XM.ItemSiteLocation"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.ItemSiteInventory = XM.Info.extend({

      recordType: "XM.ItemSiteInventory",

      editableModel: "XM.ItemSite"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSiteDetail = XM.Model.extend({

      recordType: "XM.ItemSiteDetail",

      /**
        Set distributed to zero.

      */
      clear: function () {
        this.set("distributed", 0);
        return this;
      },

      /**
        Select the balance available up to the quantity passed.

        @param {Number} Quantity
      */
      distribute: function (qty) {
        var qoh = this.get("quantity"),
          scale = XT.QTY_SCALE;

        // Calculate the change
        qty = XT.math.add(this.get("distributed"), qty, scale);

        // Can not distribute more than is available
        qty = qty > qoh ? qoh : qty;

        // Can not distribute negative
        qty = qty < 0 ? 0 : qty;

        this.set("distributed", qty);
        return this;
      },

      /**
        Overload: Ignore status issues in this implementation.
      */
      set: function () {
        return Backbone.RelationalModel.prototype.set.apply(this, arguments);
      }

    });

    // ..........................................................
    // CLASS CONSTANTS
    //

    /**
      Constants for item site inventory settings.
    */
    _.extend(XM.ItemSite, {

      // ..........................................................
      // CONSTANTS
      //

      /**
        No cost tracking.

        @static
        @constant
        @type String
        @default S
      */
      NO_COST: "N",

      /**
        Standard Cost.

        @static
        @constant
        @type String
        @default S
      */
      STANDARD_COST: "S",

      /**
        Average Cost.

        @static
        @constant
        @type String
        @default 'A'
      */
      AVERAGE_COST: "A",

      /**
        Job Cost.

        @static
        @constant
        @type String
        @default J
      */
      JOB_COST: "J",

      /**
        Not controlled method

        @static
        @constant
        @type String
        @default 'N'
      */
      NO_CONTROL: "N",

      /**
        Regular control method

        @static
        @constant
        @type String
        @default 'R'
      */
      REGULAR_CONTROL: "R"

    });

  };


}());

