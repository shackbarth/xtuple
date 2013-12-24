/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSourceModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSource = XM.Model.extend({

      recordType: "XM.ItemSource",

      handlers: {
        "status:READY_CLEAN": "statusReadyClean"
      },

      findPrice: function (quantity, site) {
        site = site || {};
        quantity = quantity || 0;
        var prices = this.get("prices");

        return _.find(prices.models, function (price) {
          var priceSite = price.get("site");
          return price.get("quantityBreak") <= quantity &&
            !priceSite || priceSite.id === site.id;
        });
      },

      calculatePrice: function (quantity, site) {
        var item = this.get("item"),
          K = XM.ItemSourcePrice,
          itemSourcePrice,
          wholesalePrice,
          price = 0;

        itemSourcePrice = this.findPrice(quantity, site);
        if (itemSourcePrice) {
          switch (itemSourcePrice.get("priceType"))
          {
          case K.TYPE_NOMINAL:
            price = itemSourcePrice.get("price");
            break;
          case K.TYPE_DISCOUNT:
            wholesalePrice = item.get("wholesalePrice");
            price = wholesalePrice - (wholesalePrice * itemSourcePrice.get("discountPercent"));
          }
        }
        return price;
      },

      statusReadyClean: function () {
        var prices;
        // Sort prices descending by quantity
        prices = this.get("prices");
        prices.comparator = function (a, b) {
          var attr = "quantityBreak",
            aval = a.get(attr),
            bval = b.get(attr);
          if (aval !== bval) {
            return bval > aval ? 1 : -1;
          }
          return 0;
        };
        prices.sort();
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSourcePrice = XM.Model.extend({

      recordType: "XM.ItemSourcePrice"

    });

    // ..........................................................
    // CONSTANTS
    //
    _.extend(XM.ItemSourcePrice, /** @lends XM.ItemSourcePrice# */{

      /**
        Nominal price.

        @static
        @constant
        @type String
        @default N
      */
      TYPE_NOMINAL: "N",

      /**
        Discount price.

        @static
        @constant
        @type String
        @default D
      */
      TYPE_DISCOUNT: "D"

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSourceManufacturer = XM.Model.extend({

      recordType: "XM.ItemSourceManufacturer"

    });



    // ..........................................................
    // COLLECTIONS
    //


    /**
      @class

      @extends XM.Collection
    */
    XM.ItemSourceCollection = XM.Collection.extend({

      model: XM.ItemSource

    });

    /**
      @class

      @extends XM.Collection
    */
    XM.ItemSourceManufacturerCollection = XM.Collection.extend({

      model: XM.ItemSourceManufacturer

    });

  };

}());

