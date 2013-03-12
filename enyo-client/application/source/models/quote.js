/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Quote = XM.Document.extend({
    /** @scope XM.Quote.prototype */

    recordType: 'XM.Quote',

    numberPolicySetting: 'QUNumberGeneration',

    documentDateKey: "quoteDate",

    freightDetail: undefined,

    freightTaxDetail: undefined,

    defaults: function () {
      var K = this.getClass(),
        settings = XT.session.settings;
      return {
        quoteDate: new Date(),
        status: K.OPEN_STATUS,
        saleType: XM.saleTypes.at(0),
        calculateFreight: settings.get("CalculateFreight"),
        margin: 0,
        subtotal: 0,
        taxTotal: 0,
        freight: 0,
        miscCharge: 0,
        total: 0
        // TO DO: site = user's preferred site?
      };
    },

    requiredAttributes: [
      "calculateFreight",
      "customer",
      "quoteDate",
      "salesRep",
      "terms"
    ],

    readOnlyAttributes: [
      "freightWeight",
      "lineItems",
      "margin",
      "status",
      "subtotal",
      "taxTotal",
      "total"
    ],

    billtoAttrArray: [
      "billtoName",
      "billtoAddress1",
      "billtoAddress2",
      "billtoAddress3",
      "billtoCity",
      "billtoState",
      "billtoPostalCode",
      "billtoCountry",
      "billtoPhone",
      "billtoContactHonorific",
      "billtoContactFirstName",
      "billtoContactMiddleName",
      "billtoContactLastName",
      "billtoContactSuffix",
      "billtoContactPhone",
      "billtoContactTitle",
      "billtoContactFax",
      "billtoContactEmail"
    ],

    shiptoAttrArray: [
      "shiptoName",
      "shiptoAddress1",
      "shiptoAddress2",
      "shiptoAddress3",
      "shiptoCity",
      "shiptoState",
      "shiptoPostalCode",
      "shiptoCountry",
      "shiptoPhone",
      "shiptoContactHonorific",
      "shiptoContactFirstName",
      "shiptoContactMiddleName",
      "shiptoContactLastName",
      "shiptoContactSuffix",
      "shiptoContactPhone",
      "shiptoContactTitle",
      "shiptoContactFax",
      "shiptoContactEmail"
    ],

    shipAddressEvents: "change:shiptoName " +
                       "change:shiptoAddress1 " +
                       "change:shiptoAddress2 " +
                       "change:shiptoAddress3 " +
                       "change:shiptoCity " +
                       "change:shiptoState " +
                       "change:shiptoPostalCode  " +
                       "change:shiptoCountry",

    // ..........................................................
    // METHODS
    //

    /**
      Initialize
    */
    initialize: function (attributes, options) {
      XM.Document.prototype.initialize.apply(this, arguments);
      var pricePolicy = XT.session.settings.get("soPriceEffective");
      this.freightDetail = [];
      this.freightTaxDetail = [];
      this.on('add:lineItems remove:lineItems', this.lineItemsDidChange);
      this.on('add:lineItems remove:lineItems change:miscCharge', this.calculateTotals);
      this.on('change:customer', this.customerDidChange);
      this.on('change:freight', this.freightDidChange);
      this.on('change:shipto', this.shiptoDidChange);
      this.on('change:scheduleDate', this.scheduleDateDidChange);
      this.on('change:shipVia', this.calculateFreight);
      this.on('change:taxZone', this.recalculateTaxes);
      this.on('change:site', this.siteDidChange);
      this.on(this.shipAddressEvents, this.shiptoAddressDidChange);
      if (pricePolicy === "OrderDate") {
        this.on('change:' + this.documentDateKey, this.recalculatePrices);
      } else if (pricePolicy === "ScheduleDate") {
        this.requiredAttributes.push("scheduleDate");
      }
    },

    /**
      Requests freight calculations from the server.

      @param {Object} Options: success, error
      @returns {Object} Receiver
    */
    calculateFreight: function () {
      var customer = this.get("customer"),
        shipto = this.get("shipto"),
        currency = this.get("currency"),
        docDate = this.get(this.documentDateKey),
        shipZone = this.get("shipZone"),
        shipVia = this.get("shipVia"),
        lineItems = this.get("lineItems").models,
        includePackageWeight = XT.session.settings.get("IncludePackageWeight"),
        scale = XT.WEIGHT_SCALE,
        that = this,
        counter,
        existing,
        line,
        itemSite,
        quantity,
        quantityUnitRatio,
        weight,
        site,
        item,
        freightClass,
        siteClass = [],
        i;

      if (this.isNotReady()) { return this; }

      if (customer && currency && docDate && lineItems.length) {
        // Collect data needed for freight
        for (i = 0; i < lineItems.length; i++) {
          line = lineItems[i];
          itemSite = line.get("itemSite");
          if (!itemSite) {
            siteClass = [];
            break;
          }
          site = itemSite.get("site");
          item = itemSite.get("item");
          freightClass = item.getValue("freightClass");
          weight = item.get("productWeight");
          quantity = line.get("quantity");
          quantityUnitRatio = line.get("quantityUnitRatio");
          if (includePackageWeight) {
            weight = XT.math.add(weight, item.get("packageWeight"), scale);
          }
          weight = XT.math.round(weight * quantity * quantityUnitRatio, scale);

          existing = _.findWhere(siteClass, {
            site: site,
            freightClass: freightClass
          });

          if (existing) {
            weight = XT.math.add(weight, existing.weight, scale);
            existing.weight = weight;
          } else {
            siteClass.push({
              site: site,
              freightClass: freightClass,
              weight: weight
            });
          }
        }

        if (siteClass.length) {
          // Loop through each site/class and fetch freight detail for that
          // combination. When we have them all, add it up and pass through
          // to original caller
          that.freightDetail = [];
          counter = siteClass.length;
          _.each(siteClass, function (item) {
            var params = [
                customer.id,
                shipto ? shipto.id : null,
                shipZone ? shipZone.id : null,
                docDate,
                shipVia || "",
                currency.id,
                item.site.id,
                item.freightClass ? item.freightClass.id : null,
                item.weight
              ],
              dispOptions = {
                success: function (resp) {
                  var freight;
                  that.freightDetail = that.freightDetail.concat(resp);
                  counter--;
                  if (!counter) { // Means we heard back from all requests
                    // Add 'em up
                    freight = XT.math.add(_.pluck(that.freightDetail, "total"), scale);
                    that.set("freight", freight, {silent: true});

                    // Now calculate tax
                    that.calculateFreightTax();
                  }
                }
              };
            that.dispatch(that.recordType, "freightDetail", params, dispOptions);
          });
          return this;
        }
      }

      // Default if we couldn't calculate
      this._calculateTotals();
      return this;
    },

    /**
      Requests freight tax detail from the server.

      @param {Object} Options: success, error
      @returns {Object} Receiver
    */
    calculateFreightTax: function () {
      var amount = this.get("freight"),
        taxType = _.where(_.pluck(XM.taxTypes.models, "attributes"), {name: "Freight"})[0],
        taxTypeId = taxType.id,
        taxZoneId = this.getValue("taxZone.id"),
        effective = this.get(this.documentDateKey),
        currency = this.get("currency"),
        that = this,
        dispOptions = {},
        params;

      if (this.isNotReady()) { return this; }

      if (effective && currency && amount) {
        params = [taxZoneId, taxTypeId, effective, currency.id, amount];
        dispOptions.success = function (resp) {
          that.freightTaxDetail = resp;
          that._calculateTotals();
        };
        this.dispatch(this.recordType, "taxDetail", params, dispOptions);
      }
      return this;
    },

    /**
      If there are line items, this function should set the date to the first scheduled
      date.

      @returns {Object} Receiver
    */
    calculateScheduleDate: function () {
      var lineItems = this.get("lineItems").models,
        scheduleDate;

      if (this.isNotReady()) { return this; }

      if (lineItems.length) {
        _.each(lineItems, function (line) {
          var lineSchedDate = line.get("scheduleDate");
          scheduleDate = scheduleDate || lineSchedDate;
          if (XT.date.compareDate(scheduleDate, lineSchedDate) > 1) {
            scheduleDate = lineSchedDate;
          }
        });
        this.set("scheduleDate", scheduleDate, {silent: true});
      }
      return this;
    },

    /**
      Used to update calculated fields. The `calcFreight` option is useful
      if it is know that freight has not changed, such as when only taxes
      are known to have changed.

      @param {Boolean} Calculate freight - default=true
      @returns {Object} Receiver
    */
    calculateTotals: function (calcFreight) {
      var calculateFreight = this.get("calculateFreight");

      if (this.isNotReady()) { return this; }

      if (calculateFreight && calcFreight !== false) {
        this.calculateFreight();
      } else {
        this._calculateTotals();
      }
      return this;
    },

    /**
      copyBilltoToShipto

      This function clears the shipto, then
      takes all the info from the billto and copies it to the shipto.
    */
    copyBilltoToShipto: function () {
      var i;
      this.unset("shipto");
      for (i = 0; i < this.shiptoAttrArray.length; i++) {
        this.set(this.shiptoAttrArray[i], this.get(this.billtoAttrArray[i]));
      }
    },

    /**
      Populates billto information based on the entered customer.
    */
    customerDidChange: function (model, value, options) {
      var customer = this.get("customer"),
        isFreeFormBillto = customer ? customer.get("isFreeFormBillto") : false,
        isFreeFormShipto = customer ? customer.get("isFreeFormShipto") : false,
        billtoContact = customer ? customer.get("billingContact") || customer.get("contact") : false,
        billtoAddress = billtoContact ? billtoContact.get("address") : false,
        billtoAttrs,
        that = this,
        unsetBilltoAddress = function () {
          that.unset("billtoName")
              .unset("billtoAddress1")
              .unset("billtoAddress2")
              .unset("billtoAddress3")
              .unset("billtoCity")
              .unset("billtoState")
              .unset("billtoPostalCode")
              .unset("billtoCountry");
        },
        unsetBilltoContact = function () {
          that.unset("billtoContact")
              .unset("billtoContactHonorific")
              .unset("billtoContactFirstName")
              .unset("billtoContactMiddleName")
              .unset("billtoContactLastName")
              .unset("billtoContactSuffix")
              .unset("billtoContactTitle")
              .unset("billtoContactPhone")
              .unset("billtoContactFax")
              .unset("billtoContactEmail");
        };

      // Handle case of prospect that has no free form settings
      isFreeFormBillto = isFreeFormBillto === undefined ? true : isFreeFormBillto;
      isFreeFormShipto = isFreeFormShipto === undefined ? true : isFreeFormShipto;

      this.setReadOnly("lineItems", !customer);

      // Set read only state for free form billto
      for (var i = 0; i < this.billtoAttrArray.length; i++) {
        this.setReadOnly(this.billtoAttrArray[i], isFreeFormBillto);
      }

      // Set read only state for free form shipto
      for (i = 0; i < this.shiptoAttrArray.length; i++) {
        this.setReadOnly(this.shiptoAttrArray[i], isFreeFormShipto);
      }

      if (this.isNotReady()) { return; }

      // Set customer default data
      if (customer) {
        billtoAttrs = {
          billtoName: customer.get("name"),
          salesRep: customer.get("salesRep"),
          commission: customer.get("commission"),
          terms: customer.get("terms"),
          taxZone: customer.get("taxZone"),
          shipVia: customer.get("shipVia"),
          site: customer.get("preferredSite"),
          currency: customer.get("currency"),
          shipto: customer.get("shipto")
        };
        if (billtoContact) {
          _.extend(billtoAttrs, {
            billtoContact: billtoContact,
            billtoContactHonorific: billtoContact.get("honoroific"),
            billtoContactFirstName: billtoContact.get("firstName"),
            billtoContactMiddleName: billtoContact.get("middleName"),
            billtoContactLastName: billtoContact.get("lastName"),
            billtoContactSuffix: billtoContact.get("suffix"),
            billtoContactTitle: billtoContact.get("title"),
            billtoContactPhone: billtoContact.get("phone"),
            billtoContactFax: billtoContact.get("fax"),
            billtoContactEmail: billtoContact.get("email")
          });
        } else {
          unsetBilltoContact();
        }
        if (billtoAddress) {
          _.extend(billtoAttrs, {
            billtoAddress1: billtoAddress.getValue("line1"),
            billtoAddress2: billtoAddress.getValue("line2"),
            billtoAddress3: billtoAddress.getValue("line3"),
            billtoCity: billtoAddress.getValue("city"),
            billtoState: billtoAddress.getValue("state"),
            billtoPostalCode: billtoAddress.getValue("postalCode"),
            billtoCountry: billtoAddress.getValue("country")
          });
        } else {
          unsetBilltoAddress();
        }
        this.set(billtoAttrs);
      } else {
        this.unset("salesRep")
            .unset("commission")
            .unset("terms")
            .unset("taxZone")
            .unset("shipVia")
            .unset("currency")
            .unset("shipZone")
            .unset("shipto")
            .unset("shiptoName")
            .unset("shiptoAddress1")
            .unset("shiptoAddress2")
            .unset("shiptoAddress3")
            .unset("shiptoCity")
            .unset("shiptoState")
            .unset("shiptoPostalCode")
            .unset("shiptoCountry")
            .unset("shiptoContact")
            .unset("shiptoHonoroific")
            .unset("shiptoContactFirstName")
            .unset("shiptoContactMiddleName")
            .unset("shiptoContactLastName")
            .unset("shiptoContactSuffix")
            .unset("shiptoContactTitle")
            .unset("shiptoContactPhone")
            .unset("shiptoContactFax")
            .unset("shiptoContactEmail");
        unsetBilltoAddress();
        unsetBilltoContact();
      }
    },

    /**
      Fetch the next quote number. Need a special over-ride here because of peculiar
      behavior of quote numbering different from all other generated numbers.
    */
    fetchNumber: function () {
      var that = this,
        options = {},
        D = XM.Document;
      options.success = function (resp) {
        that._number = resp.toString();
        that.set(that.documentKey, that._number);
        if (that.numberPolicy === D.AUTO_NUMBER) {
          that.setReadOnly(that.documentKey);
        }
      };
      this.dispatch('XM.Quote', 'fetchNumber', null, options);
      return this;
    },

    /**
    Returns quote status as a localized string.

    @returns {String}
    */
    getQuoteStatusString: function () {
      var K = this.getClass(),
        status = this.get("status");
      return status === K.OPEN_STATUS ? "_open".loc() : "_closed".loc();
    },

    /**
      If the user changed the freight determine whether they want the automatic calculation
      turned on or off as a result of their change. This function will trigger a `notify` call
      asking the question, which must be answered via the attached callback to complete the process.
    */
    freightDidChange: function () {
      if (this.isNotReady()) { return; }
      var calculateFreight = this.get("calculateFreight"),
        freight = this.get("freight"),
        that = this,
        message,
        options = {};
      options.type = XM.Model.QUESTION;
      options.callback = function (answer) {
        if (answer) {
          that.set("calculateFreight", !calculateFreight);
        } else {
          that.set("freight", that.previous("freight"));
        }
      };
      if (calculateFreight) {
        message = "_manualFreight".loc() + "_continue?".loc();
      } else if (!calculateFreight && !freight &&
                 XT.session.settings.get("CalculateFreight")) {
        message = "_autmaticFreight".loc() + "_continue?".loc();
      } else {
        return;
      }
      this.notify(message, options);
    },

    lineItemsDidChange: function () {
      var lineItems = this.get("lineItems");
      this.setReadOnly("currency", lineItems.length);
      this.setReadOnly("customer", lineItems.length);
    },

    /**
      Re-evaluate prices for all line items and freight. Will raise a `notify` question
      prompting whether the user really wants to proceed with a complete recalculation. The
      callback attached to this notification must be affirmatively answered for the recalculation
      to proceed.
    */
    recalculatePrices: function () {
      var that = this,
        msg = "_recalcuateAll?".loc(),
        options = {
          callback: function (answer) {
            if (answer) {
              _.each(that.get("lineItems").models, function (lineItem) {
                lineItem.calculatePrice(true);
              });
              that.calculateFreight();
            }
          }
        };
      this.notify(msg, options);
    },

    /**
      Re-evaluate taxes for all line items and freight.
    */
    recalculateTaxes: function () {
      _.each(this.get("lineItems").models, function (lineItem) {
        lineItem.calculateTax();
      });
      this.calculateFreightTax();
    },

    scheduleDateDidChange: function () {
      var  message = "_rescheduleAll".loc() + "_continue?".loc(),
        customer = this.get("customer"),
        scheduleDate = this.get("scheduleDate"),
        lineItems = this.get("lineItems"),
        options = {},
        that = this;

      if (this.isNotReady || !lineItems.length) { return; }

      options.type = XM.Model.QUESTION;

      // Confirm the user really wants to reschedule, then check whether all lines
      // can be updated to the requested schedule date
      options.callback = function (answer) {
        var counter = lineItems.length,
          custOptions = {},
          results = [],
          id,
          reschedule = function (ids) {
            _.each(ids, function (id) {
              lineItems.get(id).set("scheduleDate", scheduleDate);
            });
          };

        if (answer) {
          // Callback for each check
          custOptions.succes = function (canPurchase) {
            counter--;
            if (canPurchase) { results.push(id); }

            // If all items have been checked, proceed
            if (!counter) {
              
              // First check for mix of items that can be rescheduled and not
              // If partial, then ask if they only want to reschedule partial
              if (results.length && results.length !== lineItems.length) {
                message = "_partialReschedule".loc() + "_continue?".loc();
                options.callback = function (answer) {
                  if (answer) { reschedule(results); }
                  
                  // Recalculate the date because some lines may not have changed
                  that.calculateScheduleDate();
                };
                that.notify(message, options);

              // If we have results, then reschedule all of them
              } else if (results.length) {
                reschedule(results);

              // No lines can be rescheduled, just tell user "no can do"
              } else {
                that.notify("_noReschedule".loc());
                that.calculateScheduleDate(); // Recalculate the date
              }
            }
          };

          // Loop through each item and see if we can sell on
          // requested date
          _.each(lineItems, function (line) {
            var item = line.getValue("itemSite.item");
            id = line.id;
            customer.canPurchase(item, scheduleDate, custOptions);
          });
        }
      };
      this.notify(message, options);
    },

    /**
      Populate shipto defaults
    */
    shiptoDidChange: function () {
      var shipto = this.get("shipto"),
        shiptoContact = shipto ? shipto.get("contact") : false,
        shiptoAddress = shiptoContact ? shiptoContact.get("address") : false,
        shiptoAttrs;

      if (this.isNotReady() || !shipto) { return; }

      shiptoAttrs = {
        shiptoName: shipto.get("name"),
        salesRep: shipto.get("salesRep"),
        commission: shipto.get("commission"),
        taxZone: shipto.get("taxZone"),
        shipZone: shipto.get("shipZone"),
        shipVia: shipto.get("shipVia"),
        shipNotes: shipto.get("notes")
      };
      if (shiptoContact) {
        _.extend(shiptoAttrs, {
          shiptoContact: shiptoContact,
          shiptoContactHonorific: shiptoContact.get("honoroific"),
          shiptoContactFirstName: shiptoContact.get("firstName"),
          shiptoContactMiddleName: shiptoContact.get("middleName"),
          shiptoContactLastName: shiptoContact.get("lastName"),
          shiptoContactSuffix: shiptoContact.get("suffix"),
          shiptoContactTitle: shiptoContact.get("title"),
          shiptoContactPhone: shiptoContact.get("phone"),
          shiptoContactFax: shiptoContact.get("fax"),
          shiptoContactEmail: shiptoContact.get("email")
        });
      }
      if (shiptoAddress) {
        _.extend(shiptoAttrs, {
          shiptoAddress1: shiptoAddress.getValue("line1"),
          shiptoAddress2: shiptoAddress.getValue("line2"),
          shiptoAddress3: shiptoAddress.getValue("line3"),
          shiptoCity: shiptoAddress.getValue("city"),
          shiptoState: shiptoAddress.getValue("state"),
          shiptoPostalCode: shiptoAddress.getValue("postalCode"),
          shiptoCountry: shiptoAddress.getValue("country")
        });
      }
      this.set(shiptoAttrs, {silent: true});
      this.recalculatePrices();
    },

    shiptoAddressDidChange: function () {
      // If the address was manually changed, then clear shipto
      if (this.isNotReady()) { return; }
      this.unset("shipto");
    },

    siteDidChange: function () {
      if (this.isNotReady()) { return; }
      var fob = this.getValue("site.fob") || "";
      this.set("fob", fob);
    },

    statusDidChange: function () {
      XM.Document.prototype.statusDidChange.apply(this, arguments);
      var status = this.getStatus();
      if (status === XM.Model.READY_CLEAN) {
        this.setReadOnly("customer");
      }
    },

    validateSave: function () {
      var customer = this.get("customer"),
        shipto = this.get("shipto"),
        total = this.get("total"),
        lineItems = this.get("lineItems"),
        params = {};

      if (!customer.get("isFreeFormShipto") && !shipto) {
        params.attr = "_shipto".loc();
        return XT.Error.clone('xt1004', { params: params });
      }

      if (total < 0) {
        return XT.Error.clone('xt2011');
      }

      if (!lineItems.length) {
        return XT.Error.clone('xt2012');
      }
    },

    // ..........................................................
    // PRIVATE
    //

    /** @private

      Function that actually does the calculation work
    */
    _calculateTotals: function () {
      var miscCharge = this.get("miscCharge") || 0.0,
        freight = this.get("freight") || 0.0,
        scale = XT.MONEY_SCALE,
        add = XT.math.add,
        substract = XT.math.subtract,
        subtotals = [],
        taxDetails = [],
        costs = [],
        weights = [],
        subtotal,
        freightWeight,
        taxTotal = 0.0,
        costTotal,
        total,
        margin,
        taxCodes;

      // Collect line item detail
      _.each(this.get('lineItems').models, function (lineItem) {
        var extPrice = lineItem.get('extendedPrice') || 0,
          quantity = lineItem.get("quantity") || 0,
          standardCost = lineItem.getValue("itemSite.item.standardCost") || 0,
          item = lineItem.getValue("itemSite.item"),
          prodWeight = item ? item.get("productWeight") : 0,
          packWeight = item ? item.get("packageWeight") : 0,
          itemWeight = item ? add(prodWeight, packWeight, scale) : 0,
          quantityUnitRatio = lineItem.get("quantityUnitRatio"),
          grossWeight = itemWeight * quantity * quantityUnitRatio;

        weights.push(grossWeight);
        subtotals.push(extPrice);
        costs.push(quantity * standardCost);
        taxDetails = taxDetails.concat(lineItem.taxDetail);
      });

      // Add freight taxes to the mix
      taxDetails = taxDetails.concat(this.freightTaxDetail);

      // Total taxes
      // First group amounts by tax code
      taxCodes = _.groupBy(taxDetails, function (detail) {
        return detail.taxCode.id;
      });

      // Loop through each tax code group and subtotal
      _.each(taxCodes, function (group) {
        var taxes = [],
          subtotal;

        // Collect array of taxes
        _.each(group, function (detail) {
          taxes.push(detail.tax);
        });

        // Subtotal first to make sure we round by subtotal
        subtotal = add(taxes, 6);

        // Now add to tax grand total
        taxTotal = add(taxTotal, subtotal, scale);
      });

      // Totaling calculations
      freightWeight = add(weights, scale);
      subtotal = add(subtotals, scale);
      costTotal = add(costs, scale);
      margin = substract(subtotal, costTotal, scale);
      subtotals = subtotals.concat([miscCharge, freight, taxTotal]);
      total = add(subtotals, scale);

      // Set values
      this.set("freightWeight", freightWeight);
      this.set("subtotal", subtotal);
      this.set("taxTotal", taxTotal);
      this.set("total", total);
      this.set("margin", margin);
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Quote, /** @lends XM.QuoteLine# */{

    // ..........................................................
    // CONSTANTS
    //

    /**
      Quote is open.

      @static
      @constant
      @type String
      @default O
    */
    OPEN_STATUS: "O",

    /**
      Quote is closed.

      @static
      @constant
      @type String
      @default C
    */
    CLOSED_STATUS: "C"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteLine = XM.Model.extend({
    /** @scope XM.QuoteLine.prototype */

    recordType: 'XM.QuoteLine',

    sellingUnits: undefined,

    taxDetail: undefined,

    defaults: function () {
      var allowASAP = XT.session.settings.get("AllowASAPShipSchedules");
      return {
        quantityUnitRatio: 1,
        priceMode: XM.QuoteLine.DISCOUNT_MODE,
        priceUnitRatio: 1,
        scheduleDate: allowASAP ? new Date() : undefined
      };
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.apply(this, arguments);
      var settings = XT.session.settings,
        privileges = XT.session.privileges;
      this.taxDetail = [];
      this._updatePrice = true;
      this._isFractional = false;
      this.on('change:discount', this.discountDidChange);
      this.on("change:itemSite", this.itemSiteDidChange);
      this.on('change:quantity', this.calculatePrice);
      this.on('change:quantity change:price', this.calculateExtendedPrice);
      this.on('change:price', this.calculatePercentages);
      this.on('change:quote', this.parentDidChange);
      this.on('change:taxType change:extendedPrice', this.calculateTax);
      this.on('change:quantity', this.quantityDidChange);
      this.on('change:quantityUnit change:priceUnit', this.unitDidChange);
      this.on('change:scheduleDate', this.scheduleDateDidChange);
      this.on('change:extendedPrice', this.recalculateParent);
      this.on('change:extendedPrice', this.calculateProfit);
      this.on('statusChange', this.statusDidChange);

      // Only recalculate price on date changes if pricing is date driven
      if (settings.get("soPriceEffective") === "ScheduleDate") {
        this.on('change:scheduleDate', this.calculatePrice);
      }
      
      //  Disable the Discount Percent stuff if we don't allow them
      if (!settings.get("AllowDiscounts") &&
        !privileges.get("OverridePrice")) {
        this.setReadOnly('price');
        this.setReadyOnl('discount');
      }

      if (settings.get("DisableSalesOrderPriceOverride") ||
        !privileges.get("OverridePrice")) {
        this.setReadOnly('price');
      }

      this.sellingUnits = new XM.UnitCollection();
    },

    readOnlyAttributes: [
      "customerPrice",
      "extendedPrice",
      "inventoryQuantityUnitRatio",
      "lineNumber",
      "listCostMarkup",
      "listPrice",
      "listPriceDiscount",
      "priceMode",
      "priceUnitRatio",
      "profit",
      "site",
      "tax"
    ],

    requiredAttributes: [
      "customerPrice",
      "itemSite",
      "quote",
      "lineNumber",
      "quantity",
      "quantityUnit",
      "quantityUnitRatio",
      "price",
      "priceMode",
      "priceUnit",
      "priceUnitRatio",
      "scheduleDate"
    ],

    /**
      Calculates and sets the extended price.

      returns {Object} Receiver
    */
    calculateExtendedPrice: function () {
      var quantity = this.get("quantity") || 0,
        quantityUnitRatio = this.get("quantityUnitRatio"),
        priceUnitRatio = this.get("priceUnitRatio"),
        price = this.get("price") || 0,
        extPrice =  (quantity * quantityUnitRatio / priceUnitRatio) * price;
      extPrice = XT.toExtendedPrice(extPrice);
      this.set("extendedPrice", extPrice);
      return this;
    },

    /**
      Calculate and set discount and markup percentages.

      returns {Object} Receiver
    */
    calculatePercentages: function () {
      var that = this,
        parent = this.getParent(),
        currency = parent ? parent.get("currency") : false,
        parentDate = parent ? parent.get(parent.documentDateKey) : false,
        price = this.get("price"),
        options = {};

      if (this.isNotReady()) { return; }

      options.success = function (basePrice) {
        var K = that.getClass(),
          priceMode = that.get("priceMode"),
          customerPrice = that.get("customerPrice"),
          listCost = that.get("itemSite.item.listCost"),
          listPrice = that.get("listPrice"),
          attrs = {
            discount: undefined,
            listPriceDiscount: undefined,
            listCostMarkup: undefined
          };

        if (price === 0) {
          attrs.discount = priceMode === K.MARKUP_MODE ? 0 : 1;
          attrs.listPriceDiscount = 1;
          attrs.listCostMarkup = 0;
        } else {
          if (listPrice) {
            attrs.listPriceDiscount = XT.toPercent(1 - basePrice / listPrice);
          }
          if (listCost) {
            attrs.listCostMarkup = XT.toPercent(basePrice / listCost - 1);
          }
          if (customerPrice) {
            attrs.discount = priceMode === K.MARKUP_MODE ?
              XT.toPercent(price / customerPrice - 1) : // Markup
              XT.toPercent(1 - price / customerPrice);  // Discount
          }
        }

        that.set(attrs);
      };
      options.error = function (error) {
        this.trigger("error", error);
      };

      // Convert price to base, then do the real work in the callback
      currency.toBase(price, parentDate, options);

      return this;
    },

    /**
      Calculate the price for this line item

      @param{Boolean} force - force the net price to update, even if settings indicate not to.
      @returns {Object} Receiver
    */
    calculatePrice: function (force) {
      var settings = XT.session.settings,
        K = this.getClass(),
        that = this,
        canUpdate = this.canUpdate(),
        discount = this.get("discount"),
        ignoreDiscount = settings.get("IgnoreCustDisc"),
        item = this.getValue("itemSite.item"),
        editing = !this.isNew(),
        priceUnit = this.get("priceUnit"),
        priceUnitRatio = this.get("priceUnitRatio"),
        quantity = this.get("quantity"),
        quantityUnit = this.get("quantityUnit"),
        updatePolicy = settings.get("UpdatePriceLineEdit"),
        parent = this.getParent(),
        customer = parent ? parent.get("customer") : false,
        currency = parent ? parent.get("currency") :false;

      // If no parent, don't bother
      if (!parent || this.isNotReady()) { return; }

      // Make sure we have necessary values
      if (canUpdate && customer && currency &&
          item && quantity && quantityUnit &&
          priceUnit && priceUnitRatio &&
          this.priceAsOfDate()) {

        // Determine whether updating net price or only customer price
        if (editing) {
          if (!force &&
              (discount && ignoreDiscount) ||
              (updatePolicy === K.NEVER_UPDATE)) {
            this._updatePrice = false;
          } else if (updatePolicy !== K.ALWAYS_UPDATE) {
            this.notify("_updatePrice?".loc(), {
              type: K.QUESTION,
              callback: function (answer) {
                that._updatePrice = answer;
                that._calculatePrice();
              }
            });
            return this;
          }
        }
        this._calculatePrice();
      }
      return this;
    },

    calculateProfit: function () {
      var standardCost = this.getValue("itemSite.item.standardCost"),
        price = this.get("price"),
        parent = this.getParent(),
        effective = parent ? parent.get(parent.documentDateKey) : false,
        currency = parent ? parent.get("currency") : false,
        that = this,
        options = {};

      if (this.isNotReady()) { return; }

      if (price) {
        if (standardCost) {
          options.success = function (value) {
            that.set("profit", XT.toPercent((value - standardCost) / standardCost));
          };
          currency.toBase(price, effective, options);
        } else {
          this.set("profit", 1);
        }
      } else {
        this.unset("profit");
      }
    },

    calculateTax: function () {
      var parent = this.getParent(),
        amount = this.get("extendedPrice"),
        taxTypeId = this.getValue("taxType.id"),
        recordType,
        taxZoneId,
        effective,
        currency,
        that = this,
        options = {},
        params;

      // If no parent, don't bother
      if (!parent || this.isNotReady()) { return; }

      recordType = parent.recordType;
      taxZoneId = parent.getValue("taxZone.id");
      effective = parent.get(parent.documentDateKey);
      currency = parent.get("currency");

      if (effective && currency && amount) {
        params = [taxZoneId, taxTypeId, effective, currency.id, amount];
        options.success = function (resp) {
          var tax;
          that.taxDetail = resp;
          if (resp.length) {
            tax = XT.math.add(_.pluck(resp, "tax"), 6);
            that.set("tax", XT.math.round(tax, XT.SALES_PRICE_SCALE));
          } else {
            that.set("tax", 0);
          }
          that.recalculateParent(false);
        };
        this.dispatch(recordType, "taxDetail", params, options);
      } else {
        this.set("tax", 0);
      }
    },

    /**
      Recalculates and sets price from customer price based on user defined
      discount/markup.

      returns {Object} Receiver
    */
    discountDidChange: function () {
      var K = this.getClass(),
        discount = this.get("discount"),
        customerPrice = this.get("customerPrice"),
        sense = this.get("priceMode") === K.MARKUP_MODE ? -1 : 1;

      if (this.isNotReady()) { return; }

      if (!customerPrice) {
        this.unset("discount");
      } else if (this._updatePrice) {
        this.set("price", customerPrice - customerPrice * discount * sense);
      }
      return this;
    },

    itemSiteDidChange: function () {
      var parent = this.getParent(),
        taxZone = parent ? parent.get("taxZone") : undefined,
        item = this.getValue("itemSite.item"),
        characteristics = this.get("characteristics"),
        that = this,
        unitOptions = {},
        taxOptions = {},
        itemCharAttrs,
        charTypes,
        len,
        i;

      // Fetch and update selling units
      if (item) {
        unitOptions.success = function (resp) {
          // Resolve and add each id found
          _.each(resp, function (id) {
            var unit = XM.units.get(id);
            that.sellingUnits.add(unit);
          });
        };
        item.sellingUnits(unitOptions);
      }

      if (this.isNotReady()) { return; }

      // Reset values
      this.unset("quantityUnit");
      this.unset("priceUnit");
      this.unset("priceUnitRatio");
      this.unset("taxType");
      this.sellingUnits.reset();

      // Destroy old characteristics
      len = characteristics.length;
      for (i = 0; i < len; i++) {
        characteristics.at(0).destroy();
      }

      if (!item) { return; }

      // Set the item default selections
      this.set("quantityUnit", item.get("inventoryUnit"));
      this.set("priceUnit", item.get("priceUnit"));
      this.set("priceUnitRatio", item.get("priceUnitRatio"));

      // Fetch and update selling units
      unitOptions.success = function (resp) {
        // Resolve and add each id found
        _.each(resp, function (id) {
          var unit = XM.units.get(id);
          that.sellingUnits.add(unit);
        });

        // Set the item default selections
        that.set("quantityUnit", item.get("inventoryUnit"));
        that.set("priceUnit", item.get("priceUnit"));
      };
      item.sellingUnits(unitOptions);

      // Fetch and update tax type
      taxOptions.success = function (id) {
        var taxType = XM.taxTypes.get(id);
        if (taxType) {
          that.set("taxType", taxType);
        } else {
          that.unset("taxType");
        }
      };
      item.taxType(taxZone, taxOptions);

      // Set sort for characteristics
      if (!characteristics.comparator) {
        characteristics.comparator = function (a, b) {
          var aOrd = a.getValue("characteristic.order"),
            aName = a.getValue("characteristic.name"),
            bOrd = b.getValue("characteristic.order"),
            bName = b.getValue("characteristic.name");
          if (aOrd === bOrd) {
            return aName === bName ? 0 : (aName > bName ? 1 : -1);
          } else {
            return aOrd > bOrd ? 1 : -1;
          }
        };
      }

      // Build characteristics
      itemCharAttrs = _.pluck(item.get("characteristics").models, "attributes");
      charTypes = _.unique(_.pluck(itemCharAttrs, "characteristic"));
      _.each(charTypes, function (char) {
        var quoteLineChar = new XM.QuoteLineCharacteristic(null, {isNew: true}),
          defaultChar = _.find(itemCharAttrs, function (attrs) {
            return attrs.isDefault === true &&
              attrs.characteristic.id === char.id;
          });
        quoteLineChar.set("characteristic", char);
        quoteLineChar.set("value", defaultChar ? defaultChar.value : "");
        quoteLineChar.on("change:value", that.calculatePrice);
        characteristics.add(quoteLineChar);
      });

      this.calculatePrice();
      this.calculateProfit();
      this.recalculateParent();
    },

    parentDidChange: function () {
      var parent = this.getParent(),
       lineNumber = this.get("lineNumber"),
       scheduleDate;

      if (this.isNotReady()) { return; }

      // Set next line number
      if (parent && !lineNumber) {
        this.set("lineNumber", parent.get("lineItems").length);
      }

      // Default to schedule date of header
      if (parent) {
        scheduleDate = parent.get("scheduleDate");
        if (scheduleDate) {
          this.set("scheduleDate", scheduleDate);
        }
        parent.calculateScheduleDate();
      }
    },

    priceAsOfDate: function () {
      var asOf = new Date(),
        parent = this.getParent(),
        parentDate = parent ? parent.get(parent.documentDateKey) : false,
        effectivePolicy = XT.session.settings.get("soPriceEffective");

      // Handle alternate price effectivity settings
      if (effectivePolicy === "ScheduleDate") {
        asOf = this.get("scheduleDate");
      } else if (effectivePolicy === "OrderDate") {
        asOf = parentDate;
      }
      return asOf;
    },

    quantityDidChange: function () {
      var quantity = this.get("quantity"),
        quantityUnitRatio = this.get("quantityUnitRatio"),
        itemIsNotFractional = !this.get("itemSite.item.isFractional"),
        scale = this._isFractional ? 2 : 0;
        
      if (this.isNotReady()) { return; }
        
      // Check inventory quantity against conversion fractional setting
      // If invalid, notify user and update to a valid quantity
      if (itemIsNotFractional) {
        if (Math.abs((quantity * quantityUnitRatio) -
            Math.round(quantity * quantityUnitRatio)) > 0.01) {
          this.notify("_updateFractional".loc());
          quantity = XT.math.round((quantity * quantityUnitRatio + 0.5) / quantityUnitRatio, scale);
          this.set("quantity", quantity);
        }
      }
    },

    recalculateParent: function (calcFreight) {
      var parent = this.getParent();
      if (parent) { parent.calculateTotals(calcFreight); }
    },

    scheduleDateDidChange: function () {
      var item = this.getValue("itemSite.item"),
        parent = this.getParent(),
        customer = parent.get("customer"),
        shipto = parent.get("shipto"),
        scheduleDate = this.get("scheduleDate"),
        effectivePolicy = XT.session.settings.get("soPriceEffective"),
        that = this,
        options = {};

      if (this.isNotReady()) { return; }

      if (customer && item && scheduleDate) {
        options.success = function (canPurchase) {
          if (!canPurchase) {
            that.notify("_noPurchase".loc());
            that.unset("scheduleDate");
          } else {
            if (effectivePolicy === "ScheduleDate") {
              that.recalculatePrice();
            }
          }
        };
        options.shipto = shipto;
        customer.canPurchase(item, scheduleDate, options);
      }

      // Header should always show first schedule date
      if (parent) { parent.calculateScheduleDate(); }
    },

    statusDidChange: function () {
      var status = this.getStatus();
      if (status === XM.Model.READY_CLEAN) {
        this.setReadOnly("itemSite");
      }
    },

    unitDidChange: function () {
      // TODO: Look up UOM ratio
      this.quantityDidChange();
      this.calculatePrice(true);
    },
    
    validateSave: function () {
      var quantity = this.get("quantity");
            
      // Check quantity
      if ((quantity || 0) <= 0) {
        return XT.Error.clone('xt2013');
      }
      
      // Check order quantity against fractional setting
      if (!this._isFractional && Math.round(quantity) !== quantity) {
        return XT.Error.clone('xt2014');
      }
      
    },

    /** @private
      This sholud only be called by `calculatePrice`.
    */
    _calculatePrice: function () {
      var K = this.getClass(),
        that = this,
        item = this.getValue("itemSite.item"),
        characteristics = this.get("characteristics"),
        isConfigured = item ? item.get("isConfigured") : false,
        counter = isConfigured ? characteristics.length + 1 : 1,
        priceUnit = this.get("priceUnit"),
        asOf = this.priceAsOfDate(),
        quantity = this.get("quantity"),
        quantityUnit = this.get("quantityUnit"),
        readOnlyCache = this.isReadOnly("price"),
        parent = this.getParent(),
        prices = [],
        itemOptions = {},
        charOptions = {},
        parentDate,
        customer,
        currency,

        // Set price after we have item and all characteristics prices
        setPrice = function () {
          var totalPrice = XT.math.add(prices, XT.SALES_PRICE_SCALE);
          that.set("customerPrice", totalPrice);
          if (that._updatePrice) {
            that.set("price", totalPrice);
          }

          // Allow editing again if we could before
          that.setReadOnly("price", readOnlyCache);
        };

      parentDate = parent.get(parent.documentDateKey);
      customer = parent.get("customer");
      currency = parent.get("currency");

      // Don't allow user editing of price until we hear back from the server
      this.setReadOnly("price", true);

      // Get the item price
      itemOptions.asOf = asOf;
      itemOptions.currency = currency;
      itemOptions.effective = parentDate;
      itemOptions.error = function (err) {
        that.trigger("error", err);
      };

      charOptions = _.clone(itemOptions); // Some params are shared

      itemOptions.quantityUnit = quantityUnit;
      itemOptions.priceUnit = priceUnit;
      itemOptions.success = function (resp) {
        var priceMode;

        // Handle no price found scenario
        if (resp.price === -9999) {
          counter = -1;
          that.notify("_noPriceFound".loc(), { type: K.WARNING });
          if (that._updatePrice) {
            that.unset("customerPrice");
            that.unset("price");
          }
          if (that.hasChanges("quantity")) {
            that.unset("quantity");
          } else {
            that.unset("scheduleDate");
          }

        // Handle normal scenario
        } else {
          counter--;
          priceMode = (resp.type === "N" ||
                       resp.type === "D" ||
                       resp.type === "P") ? K.DISCOUNT_MODE : K.MARKUP_MODE;
          that.set("priceMode", priceMode);
          prices.push(resp.price);
          if (!counter) { setPrice(); }
        }
      };
      itemOptions.error = function (err) {
        that.trigger("error", err);
      };
      customer.itemPrice(item, quantity, itemOptions);

      // Get characteristic prices
      if (isConfigured) {
        _.each(characteristics.models, function (char) {
          var characteristic = char.get("characteristic"),
            value = char.get("value");
          charOptions.success = function (price) {
            counter--;
            char.set("price", price);
            prices.push(price);
            if (!counter) { setPrice(); }
          };
          customer.characteristicPrice(item, characteristic, value, quantity, charOptions);
        });
      }
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.QuoteLine, /** @lends XM.QuoteLine# */{

    // ..........................................................
    // CONSTANTS
    //

    /**
      Discount is calculated normally.

      @static
      @constant
      @type String
      @default D
    */
    DISCOUNT_MODE: "D",

    /**
      Never update automatically pricing once a line item has been saved.

      @static
      @constant
      @type String
      @default M
    */
    NEVER_UPDATE: 1,

    /**
      Prompt user whether to update pricing on a saved line item.

      @static
      @constant
      @type String
      @default 2
    */
    PROMPT_UPDATE: 2,

    /**
      Always update pricing automatically.

      @static
      @constant
      @type String
      @default 3
    */
    ALWAYS_UPDATE: 3

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.QuoteComment = XM.Comment.extend({
    /** @scope XM.QuoteComment.prototype */

    recordType: 'XM.QuoteComment',

    sourceName: 'Q'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteAccount = XM.Model.extend({
    /** @scope XM.QuoteAccount.prototype */

    recordType: 'XM.QuoteAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteContact = XM.Model.extend({
    /** @scope XM.QuoteContact.prototype */

    recordType: 'XM.QuoteContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteFile = XM.Model.extend({
    /** @scope XM.QuoteFile.prototype */

    recordType: 'XM.QuoteFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteItem = XM.Model.extend({
    /** @scope XM.QuoteItem.prototype */

    recordType: 'XM.QuoteItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.QuoteLineCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.QuoteLineCharacteristic.prototype */

    recordType: 'XM.QuoteLineCharacteristic',

    readOnlyAttributes: [
      "price"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.QuoteLineComment = XM.Comment.extend({
    /** @scope XM.QuoteLineComment.prototype */

    recordType: 'XM.QuoteLineComment',

    sourceName: 'QI'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.QuoteListItem = XM.Info.extend({
    /** @scope XM.QuoteListItem.prototype */

    recordType: 'XM.QuoteListItem',

    editableModel: 'XM.Quote'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.QuoteRelation = XM.Info.extend({
    /** @scope XM.QuoteRelation.prototype */

    recordType: 'XM.QuoteRelation',

    editableModel: 'XM.Quote',

    descriptionKey: "number"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteUrl = XM.Model.extend({
    /** @scope XM.QuoteUrl.prototype */

    recordType: 'XM.QuoteUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteProject = XM.Model.extend({
     /** @scope XM.QuoteProject.prototype */

    recordType: 'XM.QuoteProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteIncident = XM.Model.extend({
     /** @scope XM.QuoteIncident.prototype */

    recordType: 'XM.QuoteIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.QuoteOpportunity = XM.Model.extend({
    /** @scope XM.QuoteOpportunity.prototype */

    recordType: 'XM.QuoteOpportunity',

    isDocumentAssignment: true

  });

  /*
    @extends XM.Model
  */
  XM.QuoteCustomer = XM.Model.extend({
    /** @scope XM.QuoteCustomer.prototype */

    recordType: 'XM.QuoteCustomer',

    isDocumentAssignment: true

  });

  /*
    @extends XM.Model
  */
  XM.QuoteToDo = XM.Model.extend({

    recordType: 'XM.QuoteToDo',

    isDocumentAssignment: true

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.QuoteListItemCollection = XM.Collection.extend({
    /** @scope XM.QuoteListItemCollection.prototype */

    model: XM.QuoteListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.QuoteRelationCollection = XM.Collection.extend({
    /** @scope XM.QuoteRelationCollection.prototype */

    model: XM.QuoteRelation

  });

}());
