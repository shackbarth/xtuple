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
    
    documentDateKey: "quoteDate",

    defaults: function () {
      var //settings = XT.session.getSettings(),
          today = new Date();

      return {
        //auto order #
        quoteDate: today,
        //tax zone: none
        //site: only exists in standard edition.
        //sale type: same
        quoteStatus: "O"
        //shipping zone: probably the metric default
      };
    },
    
    /*
      calculated fields used by the line items panel
    */
    margin: 0.0,
    freightWeight: 0.0,
    subtotal: 0.0,
    tax: 0.0,
    total: 0.0,

    requiredAttributes: [
      "id",
      "number",
      "quoteDate",
      "customer",
      "miscCharge",
      "calculateFreight"
    ],
    
    billtoAttrArray: ["billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3", "billtoCity",
                        "billtoState", "billtoPostalCode", "billtoCountry", "billtoPhone", "billtoContactHonorific",
                        "billtoContactFirstName", "billtoContactMiddleName", "billtoContactLastName",
                        "billtoContactSuffix", "billtoContactPhone", "billtoContactTitle",
                        "billtoContactFax", "billtoContactEmail"],

    shiptoAttrArray: ["shiptoName", "shiptoAddress1", "shiptoAddress2", "shiptoAddress3", "shiptoCity",
                        "shiptoState", "shiptoPostalCode", "shiptoCountry", "shiptoPhone", "shiptoContactHonorific",
                        "shiptoContactFirstName", "shiptoContactMiddleName", "shiptoContactLastName",
                        "shiptoContactSuffix", "shiptoContactPhone", "shiptoContactTitle",
                        "shiptoContactFax", "shiptoContactEmail"],
    
    // ..........................................................
    // METHODS
    //
    
    /**
      Initialize
    */
    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('add:item remove:item', this.lineItemsDidChange);
      this.on('change:lineItems', this.lineItemsDidChange);
      this.on('change:customer', this.billtoDidChange);
      this.on('change:shipto', this.shiptoDidChange);
      var status = this.getStatus();
      if (!this.get("billtoName") && (status === XM.Model.READY_NEW)) {
        this.setReadOnly("lineItems", true);
        for (var i = 0; i < this.billtoAttrArray.length; i++) {
          this.setReadOnly(this.billtoAttrArray[i], true);
        }
        for (i = 0; i < this.shiptoAttrArray.length; i++) {
          this.setReadOnly(this.shiptoAttrArray[i], true);
        }
      }
    },
    
    /**
      lineItemsDidChange
      
      Used to update calculated fiels.
      Called when the user adds or removes a line item.
    */
    lineItemsDidChange: function (model, value, options) {
      var that = this,
        changed;
      //this.margin = 0.0;
      //this.freightWeight = 0.0;
      this.subtotal = 0.0;
      this.tax = 0.0;
      this.total = 0.0;

      //Total up everything
      _.each(this.get('lineItems').models, function (item) {
        //margin stuff
        //freightWeight stuff
        that.subtotal = XT.math.add(that.subtotal,
          item.get('listPrice'), XT.MONEY_SCALE);
      });

      // Notify change
      changed = {
        //margin: this.margin,
        //freightWeight: this.freightWeight,
        subtotal: this.subtotal,
        tax: this.tax,
        total: this.total
      };
      this.trigger("change", this, changed);
    },
    
    /**
      billtoDidChange
      
      Populates billto information based on the entered customer/prospect #.
    */
    billtoDidChange: function (model, value, options) {
      var theValue = value;
      
      this.setReadOnly("lineItems", false);
        
      if (theValue) {
        for (var i = 0; i < this.billtoAttrArray.length; i++) {
          this.setReadOnly(this.billtoAttrArray[i], false);
        }
        for (i = 0; i < this.shiptoAttrArray.length; i++) {
          this.setReadOnly(this.shiptoAttrArray[i], false);
        }
        //I want to use a for loop here but I can't due
        //  due to the wonkiness of CustomerProspectRelation.
        //  Will look into it later.
        //  Also, for some reason we decided to call the contact "billingContact" for Customer
        //    and just "contact" for Prospect, hence the almost-duplicate code below.
        if (theValue.editableModel === "XM.Customer") {
          this.set("billtoName", theValue.get("name"));
          this.set("billtoAddress1", theValue.getValue("billingContact.address.line1"));
          this.set("billtoAddress2", theValue.getValue("billingContact.address.line2"));
          this.set("billtoAddress3", theValue.getValue("billingContact.address.line3"));
          this.set("billtoCity", theValue.getValue("billingContact.address.city"));
          this.set("billtoState", theValue.getValue("billingContact.address.state"));
          this.set("billtoPostalCode", theValue.getValue("billingContact.address.postalCode"));
          this.set("billtoCountry", theValue.getValue("billingContact.address.country"));
          //the code below sets the shipTo of this quote as the default for this cust if shipto is empty.
          if (!this.get("shipto")) {
            this.set("shipto", theValue.get("defaultShipto"));
          }
          
        }
        else if (theValue.editableModel === "XM.Prospect") {
          this.set("billtoName", theValue.get("name"));
          this.set("billtoAddress1", theValue.getValue("contact.address.line1"));
          this.set("billtoAddress2", theValue.getValue("contact.address.line2"));
          this.set("billtoAddress3", theValue.getValue("contact.address.line3"));
          this.set("billtoCity", theValue.getValue("contact.address.city"));
          this.set("billtoState", theValue.getValue("contact.address.state"));
          this.set("billtoPostalCode", theValue.getValue("contact.address.postalCode"));
          this.set("billtoCountry", theValue.getValue("contact.address.country"));
        }
      }
      
    },
    
    /**
      shiptoDidChange
      
      When the user-entered shipto number changes, this function populates the rest of
      the fields accordingly.
    */
    shiptoDidChange: function (model, value, options) {
      var theValue = value;
      
      if (theValue) {
        for (var i = 0; i < this.shiptoAttrArray.length; i++) {
          this.setReadOnly(this.shiptoAttrArray[i], false);
        }
        if (theValue.editableModel === "XM.CustomerShipto") {
          this.set("shiptoName", theValue.get("name"));
          this.set("shiptoAddress1", theValue.getValue("contact.address.line1"));
          this.set("shiptoAddress2", theValue.getValue("contact.address.line2"));
          this.set("shiptoAddress3", theValue.getValue("contact.address.line3"));
          this.set("shiptoCity", theValue.getValue("contact.address.city"));
          this.set("shiptoState", theValue.getValue("contact.address.state"));
          this.set("shiptoPostalCode", theValue.getValue("contact.address.postalCode"));
          this.set("shiptoCountry", theValue.getValue("contact.address.country"));
        }
      }
    },
    
    /**
      copyBilltoToShipto
      
      This function empties all of the shipto information, then
      takes all the info from the billto and copies it to the shipto.
    */
    copyBilltoToShipto: function () {
      this.unset("shipto");
      for (var i = 0; i < this.shiptoAttrArray.length; i++) {
        this.set(this.shiptoAttrArray[i], this.get(this.billtoAttrArray[i]));
      }
    },
    
    /**
    Returns quote status as a localized string.

    @returns {String}
    */
    getQuoteStatusString: function () {
      if (this.get("quoteStatus") === "O") {
        return '_open'.loc();
      }
      if (this.get("quoteStatus") === "C") {
        return '_closed'.loc();
      }
    }
    
  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.QuoteLine = XM.Model.extend({
    /** @scope XM.QuoteLine.prototype */
    
    recordType: 'XM.QuoteLine',
    
    sellingUnits: undefined,
    
    defaults: function () {
      return {
        quantityUnitRatio: 1,
        priceMode: XM.QuoteLine.DISCOUNT_MODE,
        priceUnitRatio: 1
      };
    },
    
    initialize: function () {
      XM.Model.prototype.initialize.apply(this, arguments);
      this._updatePrice = true;
      this.on('change:discount', this.discountDidChange);
      this.on("change:itemSite", this.itemSiteDidChange);
      this.on('change:quantity', this.calculatePrice);
      this.on('change:quantity change:price', this.calculateExtendedPrice);
      this.on('change:price', this.calculatePercentages);
      this.on('change:price change:unitCost', this.calculateProfit);
      this.on('change:quote', this.parentDidChange);
      this.on('change:taxType change:extendedPrice', this.calculateTax);
      this.on('change:quantityUnit change:priceUnit', this.unitDidChange);
      this.on('change:scheduleDate', this.scheduleDateDidChange);
      
      // Only recalculate price on date changes if pricing is date driven
      if (XT.session.settings.get("soPriceEffective") === "ScheduleDate") {
        this.on('change:scheduleDate', this.determinePrice);
      }
      
      this.sellingUnits = new XM.UnitsCollection();
    },
    
    readOnlyAttributes: [
      "customerPrice",
      "extendedPrice",
      "inventoryQuantityUnitRatio",
      "item",
      "lineNumber",
      "listCost",
      "listCostMarkup",
      "listPrice",
      "listPriceDiscount",
      "priceMode",
      "priceUnitRatio",
      "profit",
      "site",
      "tax",
      "unitCost"
    ],
    
    requiredAttributes: [
      "customerPrice",
      "itemSite",
      "item",
      "site",
      "quote",
      "lineNumber",
      "quantity",
      "quantityUnit",
      "quantityUnitRatio",
      "price",
      "priceMode",
      "priceUnit",
      "priceUnitRatio",
      "scheduleDate",
      "unitCost"
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
      this.set("extendedPrice", extPrice, {force: true});
      return this;
    },
    
    /**
      Calculate and set discount and markup percentages.
       
      returns {Object} Receiver
    */
    calculatePercentages: function () {
      var that = this,
        parent = this.getParent(),
        currency = parent.get("currency"),
        parentDate = parent.get(parent.documentDateKey),
        price = this.get("price"),
        options = {};
      options.success = function (basePrice) {
        var K = that.getClass(),
          priceMode = that.get("priceMode"),
          customerPrice = that.get("customerPrice"),
          listCost = that.get("listCost"),
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
        
        // TODO: Handle characteristics
        this.set(attrs, {force: true});
      };
      options.error = function (error) {
        this.trigger("error", error);
      };
        
      // Convert price to base, then do the real work in the callback
      currency.toBase(price, parentDate, options);
      
      return this;
    },
    
    calculatePrice: function (force) {
      var settings = XT.session.settings,
        K = this.getClass(),
        asOf = new Date(),
        canUpdate = this.canUpdate(),
        customerPrice = this.get("customerPrice"),
        ignoreDiscount = settings.get("IgnoreCustDisc"),
        isConfigured = this.getValue("itemSite.item.isConfigured"),
        item = this.getValue("itemSite.item"),
        editing = !this.isNew(),
        options = {},
        parent = this.getParent(),
        parentDate = parent.get(parent.documentDateKey),
        customer = parent.get("customer"),
        currency = parent.get("currency"),
        price = this.get("price"),
        priceUnit = this.get("priceUnit"),
        effectivePolicy = settings.get("soPriceEffective"),
        quantity = this.get("quantity"),
        quantityUnit = this.get("quantityUnit"),
        scheduleDate = this.get("scheduleDate"),
        that = this,
        updatePolicy = settings.get("UpdatePriceLineEdit");
        
      // Make sure we have all the necessary values
      if (canUpdate && item && quantity && quantityUnit && priceUnit) {
        
        // Handle alternate price effectivity settings
        if (effectivePolicy === "ScheduleDate") {
          asOf = scheduleDate;
        } else if (effectivePolicy === "OrderDate") {
          asOf = parentDate;
        }
        
        // Determine whether updating net price or just customer price
        if (editing) {
          if (customerPrice !== price &&
             (ignoreDiscount || (updatePolicy === K.NEVER_UPDATE && !force))) {
            this._updatePrice = false;
          } else if (updatePolicy !== K.ALWAYS_UPDATE) {
            // TO DO: We need to prompt the user. How?
            this._updatePrice = false;
          }
        }
        
        if (isConfigured) {
          // TO DO: Loop through characteristics and get pricing
        }
        
        // Get the price
        options.success = function (resp) {
          var priceMode;
          
          // Handle no price found scenario
          if (resp.price === -9999) {
            that.notify("_noPriceFound".loc());
            this.unset("customerPrice");
            this.unset("price");
            if (that.hasChanges("quantity")) {
              this.unset("quantity");
            } else {
              this.unset("scheduleDate");
            }
            
          // Handle normal scenario
          } else {
            priceMode = (resp.type === "N" ||
                         resp.type === "D" ||
                         resp.type === "P") ? K.DISCOUNT_MODE : K.MARKUP_MODE;
            that.set("priceMode", priceMode);
            that.set("customerPrice", resp.price); // TO DO: Need to add char price totals here too
            if (that._updatePrice) {
              that.set("price", resp.price);
            }
          }
        };
        options.error = function (err) {
          that.trigger("error", err);
        };
        options.asOf = asOf;
        options.quantityUnit = quantityUnit;
        options.priceUnit = priceUnit;
        options.currency = currency;
        options.effective = parentDate;
        customer.price(item, quantity, options);
      }
    },
    
    calculateProfit: function () {
      var unitCost = this.get("unitCost"),
        price = this.get("price"),
        parent = this.get("parent"),
        effective = this.get(parent.documentDateKey),
        currency = parent.get("currency"),
        that = this,
        options = {},
        opt = {force: true};
      if (price) {
        if (unitCost) {
          options.success = function (value) {
            that.set("profit", (value - unitCost) / unitCost, opt);
          };
          currency.toBase(price, effective, options);
        } else {
          this.set("profit", 1, opt);
        }
      } else {
        this.unset("profit", opt);
      }
    },
    
    calculateTax: function () {
      var parent = this.getParent(),
        recordType = parent.recordType,
        amount = this.get("extendedPrice"),
        taxType = this.get("taxType"),
        taxZone = parent.get("taxZone"),
        effective = parent.get(parent.documentDateKey),
        currency = parent.get("currency"),
        that = this,
        options = {},
        params;
      if (taxType && taxZone && effective && currency && amount) {
        params = [taxZone.id, taxType.id, effective, currency.id, amount];
        options.success = function (tax) {
          that.set("tax", tax);
        };
        this.dispatch(recordType, "calculateTaxAmount", params, options);
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
        customerPrice = this.get("customer"),
        sense = this.get("priceMode") === K.MARKUP_MODE ? -1 : 1;
      if (!customerPrice) {
        this.unset("discount");
      } else if (this._updatePrice) {
        this.set("price", customerPrice - customerPrice * discount * sense);
      }
      return this;
    },
    
    itemSiteDidChange: function () {
      var item = this.getValue("itemSite.item"),
        that = this,
        unitOptions = {},
        taxOptions = {};
      
      // Reset values
      this.unset("quantityUnit");
      this.unset("priceUnit");
      this.unset("taxType");
      this.sellingUnits.reset();
      
      if (item) {
        // Fetch and update selling units
        unitOptions.success = function (resp) {
          // Set the collection
          that.sellingUnits.reset(resp);
          
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
        item.taxType(taxOptions);
      }
    },
    
    parentDidChange: function () {
      var parent = this.getParent(),
        lineNumber = this.get("lineNumber");
        
      // Set next line number
      if (parent && !lineNumber) {
        this.set("lineNumber", parent.get("lineItems").length);
      }
    },
    
    scheduleDateChanged: function () {
      var item = this.getValue("itemSite.item"),
        parent = this.get("parent"),
        customer = parent.get("customer"),
        shipto = parent.get("shipto"),
        scheduleDate = this.get("scheduleDate"),
        that = this,
        options = {};
      if (item && scheduleDate) {
        options.success = function (canPurchase) {
          if (!canPurchase) {
            that.notify("_noPurchase".loc());
            that.unset("scheduleDate");
          }
        };
        options.shipto = shipto;
        customer.canPurchase(item, scheduleDate, options);
      }
    },
    
    unitDidChange: function () {
      this.calculatePrice(true);
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

    @extends XM.Model
  */
  XM.QuoteLine = XM.Model.extend({
     /** @scope XM.QuoteLine.prototype */
  
    recordType: 'XM.QuoteLine'
  
  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.QuoteLineCharacteristic = XM.Model.extend({
    /** @scope XM.QuoteLineCharacteristic.prototype */
  
    recordType: 'XM.QuoteLineCharacteristic'
    
    //there should be some default characteristics that are pulled automatically
    //  these are reconstructed when the item site changes
    //  should probably have an itemsitedidchange function
  
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
