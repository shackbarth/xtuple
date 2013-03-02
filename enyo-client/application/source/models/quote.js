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
      this.on('add:item remove:item', this.quoteLinesDidChange);
      this.on('change:quoteLines', this.quoteLinesDidChange);
      this.on('change:customer', this.billtoDidChange);
      this.on('change:shipto', this.shiptoDidChange);
      var status = this.getStatus();
      if (!this.get("billtoName") && (status === XM.Model.READY_NEW)) {
        this.setReadOnly("quoteLines", true);
        for (var i = 0; i < this.billtoAttrArray.length; i++) {
          this.setReadOnly(this.billtoAttrArray[i], true);
        }
        for (i = 0; i < this.shiptoAttrArray.length; i++) {
          this.setReadOnly(this.shiptoAttrArray[i], true);
        }
      }
    },
    
    /**
      quoteLinesDidChange
      
      Used to update calculated fiels.
      Called when the user adds or removes a line item.
    */
    quoteLinesDidChange: function (model, value, options) {
      var that = this,
        changed;
      //this.margin = 0.0;
      //this.freightWeight = 0.0;
      this.subtotal = 0.0;
      this.tax = 0.0;
      this.total = 0.0;

      //Total up everything
      _.each(this.get('quoteLines').models, function (item) {
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
      
      this.setReadOnly("quoteLines", false);
        
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
      this.set("shipto", undefined);
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
      this.on('change:discount', this.calculateFromDiscount);
      this.on('change:quantity change:price', this.calculateExtendedPrice);
      this.on('change:quote', this.quoteChanged);
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
      extPrice = XT.Math.round(extPrice, XT.EXTENDED_PRICE_SCALE);
      this.set("extendedPrice", extPrice, {force: true});
      return this;
    },
    
    /**
      Recalculates and sets price from customer price based on user defined
      discount/markup.
      
      return {Object} Receiver
    */
    calculateFromDiscount: function () {
      var K = XM.QuoteLine,
        discount = this.get("discount"),
        customerPrice = this.get("customer"),
        mode = this.get("priceMode"),
        sense = mode === K.MARKUP_MODE ? 1 : -1;
      if (!customerPrice) {
        this.attributes.discount = undefined; // Avoid recursive looping
      } else if (this._updatePrice) {
        this.set("price", customerPrice - customerPrice * discount * sense);
      }
      return this;
    },
    
    calculatePercentages: function () {
      // calculateExtendedPrice???
    },
    
    determinePrice: function (force) {
      
    },
    
    populateItem: function () {
      
    },
    
    populateItemSubstitutes: function () {
      
    },
    
    populateItemsite: function () {
      
    },
    
    populateHistory: function () {
      
    },
    
    populateTax: function () {
      
    },
    
    priceUnitChanged: function () {
      
    },
    
    quoteChanged: function () {
      // TODO: Calculate next line number if applicable
    },
    
    quantityUnitChanged: function () {
      this.calculateExtendedPrice();
    },
    
    recalculatePrice: function () {
      
    },
    
    scheduleDateChanged: function () {
      
    },
    
    substitute: function () {
      
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
      Discount is calculated as markup. This means sign on
      customer discount should be reversed for presentation purposes.

      @static
      @constant
      @type String
      @default M
    */
    MARKUP_MODE: "M"

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
