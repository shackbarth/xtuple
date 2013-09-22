/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemSiteModels = function () {

    var proto = XM.ItemSite.prototype;
    proto.readOnlyAttributes = (proto.readOnlyAttributes || []).concat([
        'receiveLocation',
        'isReceiveLocationAuto',
        'stockLocation',
        'isStockLocationAuto',
        'userDefinedLocation'
      ]);
    proto.defaults = _.extend(proto.defaults, {
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
    var bindEvents = proto.bindEvents;
    var initialize = proto.initialize;
    var ext = {
      /**
        An array of cost methods allowed for this item site.
      */
      costMethods: null,
      bindEvents: function () {
        bindEvents.apply(this, arguments);
        this.on('change:controlMethod change:item', this.controlMethodDidChange);
        this.on('change:costMethod', this.costMethodDidChange);
      },

      controlMethodDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          controlMethod = this.get("controlMethod"),
          costMethod = this.get("costMethod"),
          item = this.get("item"),
          itemType = item ? item.get("itemType") : false,
          settings = XT.sessision.settings,
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

        /* Determine if Job Cost is possible */
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
          this.handleJobCost();
        }
      },

      initialize: function () {
        initialize.apply(this, arguments);
        var K = XM.ItemSite,
          settings = XT.sessision.settings,
          allowAvg = settings.get("AllowAvgCostMethod"),
          allowStd = settings.get("AllowStdCostMethod"),
          allowJob = settings.get("AllowJobCostMethod");

        // Determine which cost types are allowed
        this.costMethodsAllowed.push(K.NO_COST);
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

      costMethodDidChange: function () {
        var K = XM.ItemSite,
          I = XM.Item,
          costMethod = this.get("costMethod"),
          isSold = false,
          plannerCode = false,
          isStocked = false,
          isAutomaticAbcClassUpdates = false,
          abcClass = false,
          cycleCountFrequency = false,
          isLocationControl = false,
          receiveLocation = false,
          isReceiveLocationAuto = false,
          stockLocation = false,
          isStockLocationAuto = false,
          userDefinedLocation = false,
          locationComment = false,
          useParameters = false,
          reorderLevel = false,
          orderToQuantity = false,
          minimumOrderQuantity = false,
          maximumOrderQuantity = false,
          multipleOrderQuantity = false,
          restrictedLoctionsAllowed = false,
          useParametersManual = false,
          safetyStock = false,
          leadTime = false;
        switch (costMethod) {
        case K.JOB_COST:
          if (I.MANUFACTURED) {
            isSold = true;
            plannerCode = true;
            isStocked = true;
            abcClass = true;
            isAutomaticAbcClassUpdates = true;
            abcClass = true;
            cycleCountFrequency = true;
            isLocationControl = true;
            receiveLocation = true;
            isReceiveLocationAuto = true;
            stockLocation = true;
            isStockLocationAuto = true;
            userDefinedLocation = true;
            locationComment = true;
            useParameters = true;
            reorderLevel = true;
            orderToQuantity = true;
            minimumOrderQuantity = true;
            maximumOrderQuantity = true;
            multipleOrderQuantity = true;
            restrictedLoctionsAllowed = true;
            useParametersManual = true;
            safetyStock = true;
            leadTime = true;
            this.set("isSold", false);
            this.set("isAutomaticAbcClassUpdates", false);
            this.set("cycleCountFrequency", 0);
            this.set("useParameters", false);
            this.set("isStocked", false);
            this.set("locationControl", false);
            this.set("safetyStock", 0);
          }
          else if (I.PURCHASED || I.OUTSIDE_PROCESS) {
            isSold = false;
            abcClass = true;
            isAutomaticAbcClassUpdates = true;
            cycleCountFrequency = true;
            isStocked = true;
            isLocationControl = true;
            restrictedLoctionsAllowed = true;
            safetyStock = true;
            useParameters = true;
            this.set("isSold", true);
            this.set("isAutomaticAbcClassUpdates", false);
            this.set("cycleCountFrequency", 0);
            this.set("useParameters", false);
            this.set("isStocked", false);
            this.set("locationControl", false);
            this.set("safetyStock", 0);
          }
          else {
            isStocked = true;
          }
        }
        this.setReadOnly("isSold", isSold);
        this.setReadOnly("plannerCode", plannerCode);
        this.setReadOnly("isStocked", isStocked);
        this.setReadOnly("abcClass", abcClass);
        this.setReadOnly("isAutomaticAbcClassUpdates", isAutomaticAbcClassUpdates);
        this.setReadOnly("abcClass", abcClass);
        this.setReadOnly("cycleCountFrequency", cycleCountFrequency);
        this.setReadOnly("isLocationControl", isLocationControl);
        this.setReadOnly("receiveLocation", receiveLocation);
        this.setReadOnly("isReceiveLocationAuto", isReceiveLocationAuto);
        this.setReadOnly("stockLocation", stockLocation);
        this.setReadOnly("isStockLocationAuto", isStockLocationAuto);
        this.setReadOnly("userDefinedLocation", userDefinedLocation);
        this.setReadOnly("locationComment", locationComment);
        this.setReadOnly("useParameters", useParameters);
        this.setReadOnly("reorderLevel", reorderLevel);
        this.setReadOnly("orderToQuantity", orderToQuantity);
        this.setReadOnly("minimumOrderQuantity", minimumOrderQuantity);
        this.setReadOnly("maximumOrderQuantity", maximumOrderQuantity);
        this.setReadOnly("multipleOrderQuantity", multipleOrderQuantity);
        this.setReadOnly("restrictedLoctionsAllowed", restrictedLoctionsAllowed);
        this.setReadOnly("useParametersManual", useParametersManual);
        this.setReadOnly("safetyStock", safetyStock);
        this.setReadOnly("leadTime", leadTime);
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

