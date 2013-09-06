/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, Backbone:true */

(function () {
  "use strict";

  XT.extensions.inventory.initItemSiteModels = function () {

    var locationBehaviorFunctions = {

      defaults: function () {
        var K = XM.ItemSite;
        this.setReadOnly(this.get('receiveLocation'), true);
        this.setReadOnly(this.get('isReceiveLocationAuto'), true);
        this.setReadOnly(this.get('stockLocation'), true);
        this.setReadOnly(this.get('isStockLocationAuto'), true);
        this.setReadOnly(this.get('userDefinedLocation'), true);
      },
      /*TODO get this non-orm field into the model
      isUseDefaultLocation: function () {
        return [false, true];
      },

      isUseDefaultLocationDidChange: function () {
        var K = XM.ItemSite,
          isUseDefaultLocation = this.get('isUseDefaultLocation'),
          isLocationControl = this.get('isLocationControl'),
          receiveLocation = true,
          isReceiveLocationAuto = true,
          stockLocation = true,
          isStockLocationAuto = true,
          userDefinedLocation = true;
        if (isUseDefaultLocation === true && isLocationControl === false) {
          receiveLocation = false;
          isReceiveLocationAuto = false;
          stockLocation = false;
          isStockLocationAuto = false;
          userDefinedLocation = false;
        }
        else if (isUseDefaultLocation === true && isLocationControl === true) {
          receiveLocation = false;
          isReceiveLocationAuto = false;
          stockLocation = false;
          isStockLocationAuto = false;
          userDefinedLocation = true;
        }
        this.setReadOnly('receiveLocation', receiveLocation);
        this.setReadOnly('isReceiveLocationAuto', isReceiveLocationAuto);
        this.setReadOnly('stockLocation', stockLocation);
        this.setReadOnly('isStockLocationAuto', isStockLocationAuto);
        this.setReadOnly('userDefinedLocation', userDefinedLocation);
      }, */

      //TODO get the following function to work.
      costMethod: function () {
        var K = XM.ItemSite,
          itemType = this.get("item.itemType"),
          costMethod = this.get("costMethod");
        if (itemType === "P") {
          return costMethod = ["A", "S"];
        }
      },

      controlMethodDidChange: function () {
        var K = XM.ItemSite,
          controlMethod = this.get("controlMethod");
        if (controlMethod === K.NO_CONTROL) {
          this.setReadOnly('costMethod', true);
          this.set('costMethod', 'N');
        }
        else if (controlMethod !== K.NO_CONTROL) {
          this.setReadOnly('costMethod', false);
          this.set('costMethod', 'S');
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
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('change:controlMethod', this.controlMethodDidChange);
        this.on('change:costMethod', this.costMethodDidChange);
      //  this.on('change:isUseDefaultLocation', this.isUseDefaultLocationDidChange);
      }
    };

    XM.ItemSite = XM.ItemSite.extend(locationBehaviorFunctions);
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

