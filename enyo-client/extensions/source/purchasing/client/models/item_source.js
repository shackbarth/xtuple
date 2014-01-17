/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true, console:true, Globalize:true */

(function () {
  "use strict";

  XT.extensions.purchasing.initItemSourceModels = function () {

    /** @private */
    var _descComparator = function (a, b) {
      var attr = "quantityBreak",
        aval = a.get(attr),
        bval = b.get(attr);
      if (aval !== bval) {
        return bval > aval ? 1 : -1;
      }
      return 0;
    };

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSource = XM.Model.extend({

      recordType: "XM.ItemSource",

      defaults: function () {
        return {
          isActive: true,
          isDefault: false,
          effective: XT.date.startOfTime(),
          expires: XT.date.endOfTime(),
          leadTime: 0,
          ranking: 1
        };
      },

      handlers: {
        "change:item change:vendor change:effective change:expires": "checkDuplicate",
        "change:vendor": "vendorChanged",
        "status:READY_CLEAN": "statusReadyClean"
      },

      nameAttribute: "vendorItemNumber",

      readOnlyAttributes: [
        "prices"
      ],

      findPrice: function (quantity, site) {
        site = site || {};
        quantity = quantity || 0;
        var prices = this.get("prices"),
         prvComparator = prices.comparator,
         itemSourcePrice;

        // Cache comparator
        prices.comparator = _descComparator;
        prices.sort();

        itemSourcePrice = _.find(prices.models, function (price) {
          var priceSite = price.get("site");
          return price.get("quantityBreak") <= quantity &&
            (!priceSite || priceSite.id === site.id);
        });

        // Set back to previous sort
        prices.comparator = prvComparator;
        if (prvComparator) { prices.sort(); }

        return itemSourcePrice;
      },

      calculatePrice: function (quantity, site) {
        var item = this.get("item"),
          K = XM.ItemSourcePrice,
          itemSourcePrice,
          wholesalePrice,
          percentDiscount,
          fixedDiscount,
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
            percentDiscount = this.get("percentDiscount");
            fixedDiscount = this.get("fixedDiscount");
            price = wholesalePrice - (wholesalePrice * percentDiscount) - fixedDiscount;
          }
        }
        return price >= 0 ? price : 0;
      },

      checkDuplicate: function (callback) {
        var that = this,
          item = this.get("item"),
          vendor = this.get("vendor"),
          effective = this.get("effective"),
          expires = this.get("expires"),
          options = {},
          params;

        if (!item || !vendor || !effective || !expires) {
          // no need to check for duplicates unless both fields are set
          if (typeof callback === "function") {
            callback.call(that);
          }
          return;
        }

        options.success = function (resp) {
          var err, params = {};

          if (resp) {
            // validation fail. This pair already exists
            params.attr = "_item".loc() + " " + "_and".loc() + " " + "_vendor".loc();
            params.value = [that.getValue("item.number"), that.getValue("vendor.number")];
            params.response = resp;
            err = XT.Error.clone("xt1008", { params: params });
            that.trigger("invalid", that, err, options);
            if (typeof callback === "function") {
              callback.call(that, err);
            }

          } else {
            if (typeof callback === "function") {
              callback.call(that);
            }
          }
        };

        options.error = function (err) {
          console.log("Error searching for duplicate item source", err);
          if (typeof callback === "function") {
            callback.call(that, true);
          }
        };

        params = [this.id, item.id, vendor.id, effective, expires];

        this.dispatch("XM.ItemSource", "hasDuplicate", params, options);
      },

      statusReadyClean: function () {
        this.setReadOnly(["vendor", "item"]);
        this.setReadOnly("prices", false);
      },

      save: function (key, value, options) {
        var that = this,
          K = XM.Model,
          status = this.getStatus(),
          callback = function () {
            XM.Model.prototype.save.call(this, key, value, options);
          };

        // Check for duplicates if we should
        if (status === K.READY_NEW ||
           (this.get("effective") !== this.original("effective") ||
            this.get("expires") !== this.original("expires"))) {
          this.checkDuplicate(callback);

        // Otherwise just go ahead and save
        } else {
          callback();
        }
      },

      validate: function () {
        var err = XM.Model.prototype.validate.apply(this, arguments),
          effective = this.get("effective"),
          expires = this.get("expires"),
          params = {};
        
        if (!err) {
          if (XT.date.compare(effective, expires) > -1) {
            params.start = Globalize.format(effective, "d");
            params.end = Globalize.format(expires, "d");
            err = XT.Error.clone("xt2015", {params: params});
          } else if (this.get("isActive") && !this.getValue("item.isActive")) {
            err = XT.Error.clone("pur1001");
          }
        }

        return err;
      },

      vendorChanged: function () {
        this.setReadOnly("prices", !_.isObject(this.get("vendor")));
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.ItemSourcePrice = XM.Model.extend({

      recordType: "XM.ItemSourcePrice",

      defaults: function () {
        return {
          currency: XT.baseCurrency(),
          priceType: XM.ItemSourcePrice.TYPE_NOMINAL
        };
      },

      handlers: {
        "change:itemSource": "itemSourceChanged",
        "change:priceType": "priceTypeChanged"
      },

      canView: function (attr) {
        var isNominal = this.attributes ? this.get("priceType") === XM.ItemSourcePrice.TYPE_NOMINAL : false;
        if (attr === "price") {
          return isNominal;
        } else if (attr === "percentDiscount" ||
                   attr === "fixedDiscount") {
          return !isNominal;
        }
        return XM.Model.prototype.canView.apply(this, arguments);
      },

      itemSourceChanged: function () {
        var itemSource = this.get("itemSource"),
          currency;
        if (itemSource) {
          currency = itemSource.getValue("vendor.currency") || XT.baseCurrency();
          this.set("currency", currency);
        }
      },

      priceTypeChanged: function () {
        var priceType = this.get("priceType"),
         isNominal = priceType === XM.ItemSourcePrice.TYPE_NOMINAL;
        if (isNominal) {
          this.unset("percentDiscount");
          this.unset("fixedDiscount");
        } else {
          this.unset("price");
        }
      },

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

