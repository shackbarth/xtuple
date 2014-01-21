/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  XM.CustomerMixin = {

    /**
      Request whether a customer can purchase a given item on a given date.

      @param {XM.Item} Item
      @param {Number} ScheduleDate
      @param {XM.Item} Shipto (optional)
      @param {Object} Options - success (callback), shipto
      @returns {Object} Receiver
    */
    canPurchase: function (item, scheduleDate, options) {
      if (!item || !scheduleDate || !options || !options.success) { return; }
      var params,
        shiptoId = options.shipto ? options.shipto.id : null;
      params = [this.id, item.id, scheduleDate, shiptoId];
      this.dispatch("XM.Customer", "canPurchase", params, options);
      return this;
    },

    /**
      Retrieve the customer's price for a given item and quantity.

      @param {XM.Item} Item
      @param {Number} Quantity
      @param {Object} Options - success (callback), asOf, shipto, quantityUnit, priceUnit, currency, effective
      @returns {Object} Receiver
    */
    characteristicPrice: function (item, characteristic, value, quantity, options) {
      if (!item || !quantity || !options || !options.success) { return; }
      var opts = {},
        params;
      if (options.asOf) {
        opts.asOf = options.asOf;
      }
      if (options.shipto) {
        opts.shiptoId = options.shipto.id;
      }
      if (options.currency) {
        opts.currencyId = options.currency.id;
      }
      if (options.effective) {
        opts.effective = options.effective;
      }
      params = [this.id, item.id, characteristic.id, value, quantity, opts];
      this.dispatch("XM.Customer", "characteristicPrice", params, options);
      return this;
    },

    getDefaultShipto: function () {
      if (!this.get("shiptos")) {
        return null;
      }
      var defaultShipto = _.filter(this.get("shiptos").models, function (shipto) {
        return shipto.get("isDefault");
      });
      return defaultShipto.length > 0 ? defaultShipto[0] : null;
    },

    /**
      Retrieve the customer's price for a given item and quantity.

      @param {XM.Item} Item
      @param {Number} Quantity
      @param {Object} Options - success (callback), asOf, shipto, quantityUnit, priceUnit, currency, effective
      @returns {Object} Receiver
    */
    itemPrice: function (item, quantity, options) {
      if (!item || !quantity || !options || !options.success) { return; }
      var opts = {},
        params;
      if (options.asOf) {
        opts.asOf = options.asOf;
      }
      if (options.shipto) {
        opts.shiptoId = options.shipto.id;
      }
      if (options.quantityUnit) {
        opts.quantityUnitId = options.quantityUnit.id;
      }
      if (options.priceUnit) {
        opts.priceUnitId = options.priceUnit.id;
      }
      if (options.currency) {
        opts.currencyId = options.currency.id;
      }
      if (options.effective) {
        opts.effective = options.effective;
      }
      if (options.site) {
        opts.siteId = options.site.id;
      }
      params = [this.id, item.id, quantity, opts];
      this.dispatch("XM.Customer", "itemPrice", params, options);
      return this;
    }
  };

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Customer = XM.AccountDocument.extend({
    /** @scope XM.Customer.prototype */

    recordType: 'XM.Customer',

    conversionMap: {
      name: "name",
      primaryContact: "billingContact",
      secondaryContact: "correspondenceContact"
    },

    defaults: function () {
      var settings = XT.session.getSettings(),
        salesRep = XM.salesReps.get(settings.get("DefaultSalesRep"));
      return {
        isActive: true,
        creditStatus: "G",
        currency: XT.baseCurrency(),
        salesRep: salesRep ? salesRep.id : null,
        terms: settings.get("DefaultTerms"),
        shipVia: this.getShipViaValue(),
        customerType: settings.get("DefaultCustType"),
        backorder: settings.get("DefaultBackOrders") || false,
        partialShip: settings.get("DefaultPartialShipments") || false,
        isFreeFormShipto: settings.get("DefaultFreeFormShiptos") || false,
        autoUpdateStatus: false,
        autoHoldOrders: false,
        isFreeFormBillto: false,
        commission: salesRep ? salesRep.get("commission") : 0,
        discount: 0,
        blanketPurchaseOrders: false,
        usesPurchaseOrders: false,
        creditLimit: settings.get("SOCreditLimit"),
        creditRating: settings.get("SOCreditRate"),
        balanceMethod: settings.get("DefaultBalanceMethod") || "B"
      };
    },

    readOnlyAttributes: [
      "partialShip",
      "blanketPurchaseOrders"
    ],

    // ..........................................................
    // METHODS
    //

    /**
      Initialize
    */
    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:usesPurchaseOrders', this.purchaseOrdersDidChange);
      this.on('change:backorder', this.backorderDidChange);
      this.on('change:salesRep', this.salesRepDidChange);
    },

    backorderDidChange: function () {
      if (this.get("backorder")) {
        this.setReadOnly("partialShip", false);
      } else if (!this.get("backorder")) {
        this.set("partialShip", false);
        this.setReadOnly("partialShip", true);
      }
    },

    getShipViaValue: function () {
      var ret,
        shipViaModel = XM.shipVias.get(XT.session.getSettings().get("DefaultShipViaId"));
      if (shipViaModel) {
        ret = shipViaModel.get("code") + "-" + shipViaModel.get("description");
      }
      else {
        ret = "";
      }

      return ret;
    },

    purchaseOrdersDidChange: function () {
      if (this.get("usesPurchaseOrders")) {
        this.setReadOnly("blanketPurchaseOrders", false);
      } else if (!this.get("usesPurchaseOrders")) {
        this.set("blanketPurchaseOrders", false);
        this.setReadOnly("blanketPurchaseOrders", true);
      }
    },

    /**
      Sets read only status of customerType according to privs
    */
    statusDidChange: function () {
      var status = this.getStatus(),
          privileges = XT.session.getPrivileges(),
          K = XM.Model;
      XM.Document.prototype.statusDidChange.apply(this, arguments);
      if (status === K.READY_NEW) {
        if (!privileges.get("MaintainCustomerMastersCustomerType") &&
          !privileges.get("MaintainCustomerMastersCustomerTypeOnCreate")) {
          this.setReadOnly("customerType", true);
        }
      } else if (status === K.READY_CLEAN) {
        if (!privileges.get("MaintainCustomerMastersCustomerType")) {
          this.setReadOnly("customerType", true);
        }
      }
    },

    /**
      Creates a new prospect model and fetches based on the given ID.
      Takes attributes from the prospect model and gives them to this customer model.
      The prospect model will be destroyed by the save function.
    */
    convertFromProspect: function (id) {
      var prospect = new XM.Prospect(),
        fetchOptions = {},
        that = this;
      // this id is the natural key, which is the number
      // for both customer and prospect
      fetchOptions.id = id;

      fetchOptions.success = function (resp) {
        that.set("name", prospect.get("name"));
        that.set("billingContact", prospect.get("contact"));
        that.set("salesRep", prospect.get("salesRep"));
        that.set("preferredSite", prospect.get("site"));
        that.set("taxZone", prospect.get("taxZone"));
        that.setReadOnly("number", false);
        that.set("number", prospect.id);
        that.setReadOnly("number", true);
        that.revertStatus();
        that.checkConflicts = false;
      };
      fetchOptions.error = function (resp) {
        XT.log("Fetch failed in convertFromProspect");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      prospect.fetch(fetchOptions);
    },

    salesRepDidChange: function () {
      var salesRep = this.get('salesRep');
      if (!salesRep) { return; }
      this.set('commission', salesRep.get('commission'));
    },

    /**
      In the Customer Tax Registrations, the effective date
      cannot be prior to the expires date.
    */
    validate: function () {
      var error, params = {},
        taxReg = this.get("taxRegistration");

      error = XM.AccountDocument.prototype.validate.apply(this, arguments);
      if (error) { return error; }

      if (taxReg.length) {
        _.each(taxReg.models, function (t) {
          if (XT.date.compareDate(t.get("effective"), t.get("expires")) === 1) {
            params.start = "_effective".loc();
            params.end = "_expires".loc();
            error = XT.Error.clone('xt2015', { params: params });
            return false;
          }
        });
      }

      return error;
    }

  });

  // ..........................................................
  // CLASS METHODS
  //
  _.extend(XM.Customer, /** @lends XM.Customer# */{

    used: function (id, options) {
      return XM.ModelMixin.dispatch('XM.Customer', 'used', [id], options);
    },

    // ..........................................................
    // CONSTANTS
    //

    /**
      Customer is credit is in good standing.

      @static
      @constant
      @type String
      @default G
    */
    CREDIT_GOOD: "G",

    /**
      Customer is on credit warn.

      @static
      @constant
      @type String
      @default W
    */
    CREDIT_WARN: "W",

    /**
      Customer is on credit hold.

      @static
      @constant
      @type String
      @default H
    */
    CREDIT_HOLD: "H"

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.CustomerComment = XM.Comment.extend({
    /** @scope XM.CustomerComment.prototype */

    recordType: 'XM.CustomerComment',

    sourceName: 'C'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.CustomerCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.CustomerCharacteristic.prototype */

    recordType: 'XM.CustomerCharacteristic',

    which: 'isCustomers'

  });

  XM.CustomerEmailProfile = XM.Model.extend({

    recordType: "XM.CustomerEmailProfile"

  });
  /**
    @class

    @extends XM.Model
  */
  XM.CustomerAccount = XM.Model.extend({
    /** @scope XM.CustomerAccount.prototype */

    recordType: 'XM.CustomerAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerCustomer = XM.Model.extend({
    /** @scope XM.CustomerCustomer.prototype */

    recordType: 'XM.CustomerCustomer',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerContact = XM.Model.extend({
    /** @scope XM.CustomerContact.prototype */

    recordType: 'XM.CustomerContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerItem = XM.Model.extend({
    /** @scope XM.CustomerItem.prototype */

    recordType: 'XM.CustomerItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerFile = XM.Model.extend({
    /** @scope XM.CustomerFile.prototype */

    recordType: 'XM.CustomerFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerUrl = XM.Model.extend({
    /** @scope XM.CustomerUrl.prototype */

    recordType: 'XM.CustomerUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerTaxRegistration = XM.Model.extend({
    /** @scope XM.CustomerTaxRegistration.prototype */

    recordType: 'XM.CustomerTaxRegistration'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.CustomerGroup = XM.Document.extend({
    /** @scope XM.CustomerGroup.prototype */

    recordType: 'XM.CustomerGroup',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerCustomerGroup = XM.Model.extend({
    /** @scope XM.CustomerCustomerGroup.prototype */

    recordType: 'XM.CustomerCustomerGroup'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerGroupCustomer = XM.Model.extend({
    /** @scope XM.CustomerGroupCustomer.prototype */

    recordType: 'XM.CustomerGroupCustomer'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerShipto = XM.Model.extend({
    /** @scope XM.CustomerShipto.prototype */

    recordType: 'XM.CustomerShipto',

    defaults: {
      isActive: true,
      isDefault: false
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:customer', this.customerDidChange);
      this.on('change:salesRep', this.salesRepDidChange);
      this.on('change:isDefault', this.isDefaultDidChange);
      this.on('change:number', this.numberDidChange);
    },

    customerDidChange: function () {
      var status = this.getStatus(),
        customer = this.get("customer"),
        K = XM.Model;

      if (customer && status === K.READY_NEW) {
        // Set defaults from customer
        this.set("salesRep", customer.get("salesRep"));
        this.set("shipZone", customer.get("shipZone"));
        this.set("taxZone", customer.get("taxZone"));
        this.set("shipVia", customer.get("shipVia"));
        this.set("shipCharge", customer.get("shipCharge"));
      }
    },

    isDefaultDidChange: function () {
      if (!this.get("isDefault")) { return; }
      var customer = this.get("customer"),
        shiptos = customer.get("shiptos"),
        that = this;
      _.each(shiptos.models, function (shipto) {
        if (shipto.id !== that.id && shipto.get("isDefault")) {
          shipto.set("isDefault", false);
        }
      });
    },

    numberDidChange: function () {
      if (!this.numberIsValid()) {
        this.trigger("invalid", this, XT.Error.clone("xt2003"), {});
      }
    },

    /**
      Checks for duplicate ship to numbers.
    */
    numberIsValid: function () {
      var customer = this.get("customer"),
        shiptos,
        shipto,
        i;
      if (customer) {
        shiptos = customer.get("shiptos");
        for (i = 0; i < shiptos.length; i++) {
          shipto = shiptos.at(i);
          if (shipto.id !== this.id &&
              shipto.get("number") === this.get("number")) {
            return false;
          }
        }
      }
      return true;
    },

    salesRepDidChange: function () {
      var salesRep = this.get('salesRep');
      if (!salesRep) { return; }
      this.set('commission', salesRep.get('commission'));
    },

    validate: function () {
      if (this.isDirty() && !this.numberIsValid()) {
        return XT.Error.clone("xt2003");
      }
      return XM.Model.prototype.validate.apply(this, arguments);
    }

  });

  // Add in item mixin
  XM.Customer = XM.Customer.extend(XM.CustomerMixin);

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerShiptoRelation = XM.Document.extend({
    /** @scope XM.CustomerShiptoRelation */

    recordType: 'XM.CustomerShiptoRelation',

    editableModel: 'XM.CustomerShipto',

    documentKey: 'number'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesCustomerShiptoRelation = XM.Document.extend({
    /** @scope XM.CustomerShiptoRelation */

    recordType: 'XM.SalesCustomerShiptoRelation',

    editableModel: 'XM.CustomerShipto',

    documentKey: 'number'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerTaxRegistration = XM.Document.extend({
    /** @scope XM.CustomerTaxRegistration */

    recordType: 'XM.CustomerTaxRegistration',

    documentKey: 'number'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerType = XM.Document.extend({
    /** @scope XM.CustomerType.prototype */

    recordType: 'XM.CustomerType',

    documentKey: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.BillingCustomer = XM.AccountDocument.extend({
    /** @scope XM.BillingCustomer.prototype */

    recordType: 'XM.BillingCustomer',

    descriptionKey: "name"

  });

  XM.BillingCustomer = XM.BillingCustomer.extend(XM.CustomerMixin);

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.SalesCustomer = XM.AccountDocument.extend({
    /** @scope XM.SalesCustomer.prototype */

    recordType: 'XM.SalesCustomer',

    descriptionKey: "name"

  });

  // Add in item mixin
  XM.SalesCustomer = XM.SalesCustomer.extend(XM.CustomerMixin);

  /**
    @class

    @extends XM.Info
  */
  XM.CustomerListItem = XM.Info.extend({
    /** @scope XM.CustomerListItem.prototype */

    recordType: 'XM.CustomerListItem',

    editableModel: 'XM.Customer',

    descriptionKey: "name"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.CustomerRelation = XM.Info.extend({
    /** @scope XM.CustomerRelation.prototype */

    recordType: 'XM.CustomerRelation',

    editableModel: 'XM.Customer',

    descriptionKey: "name"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ShipCharge = XM.Document.extend({
    /** @scope XM.CustomerCharge.prototype */

    recordType: 'XM.ShipCharge',

    documentKey: 'name',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ShipVia = XM.Document.extend({
    /** @scope XM.CustomerVia.prototype */

    recordType: 'XM.ShipVia',

    documentKey: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ShipZone = XM.Document.extend({
    /** @scope XM.ShipZone.prototype */

    recordType: 'XM.ShipZone',

    documentKey: 'name',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Info
  */
  XM.CustomerProspectListItem = XM.Info.extend({
    /** @scope XM.CustomerProspectListItem.prototype */

    recordType: 'XM.CustomerProspectListItem',

    editableModel: 'XM.Customer'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.CustomerProspectRelation = XM.Info.extend({
    /** @scope XM.CustomerProspectReltion.prototype */

    recordType: 'XM.CustomerProspectRelation',

    editableModel: 'XM.Customer'

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.CustomerProspectRelation, {

    /**
      Customer/Prospect is Prospect.

      @static
      @constant
      @type String
      @default P
    */
    PROSPECT_STATUS: 'P',

    /**
      Customer/Prospect is Customer.
      @static
      @constant
      @type String
      @default C
    */
    CUSTOMER_STATUS: 'C'

  });

  // Add in mixins
  XM.CustomerProspectRelation = XM.CustomerProspectRelation.extend(XM.CustomerMixin);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.BillingCustomerCollection = XM.Collection.extend({
    /** @scope XM.BillingCustomerCollection.prototype */

    model: XM.BillingCustomer

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesCustomerCollection = XM.Collection.extend({
    /** @scope XM.SalesCustomerCollection.prototype */

    model: XM.SalesCustomer

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerListItemCollection = XM.Collection.extend({
    /** @scope XM.CustomerListItemCollection.prototype */

    model: XM.CustomerListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerRelationCollection = XM.Collection.extend({
    /** @scope XM.CustomerRelationCollection.prototype */

    model: XM.CustomerRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerTypeCollection = XM.Collection.extend({
    /** @scope XM.CustomerTypeCollection.prototype */

    model: XM.CustomerType

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerCustomerGroupCollection = XM.Collection.extend({
    /** @scope XM.CustomerCustomerGroupCollection.prototype */

    model: XM.CustomerCustomerGroup

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerGroupCustomerCollection = XM.Collection.extend({
    /** @scope XM.CustomerGroupCustomerCollection.prototype */

    model: XM.CustomerGroupCustomer

  });

  XM.CustomerEmailProfileCollection = XM.Collection.extend({
    model: XM.CustomerEmailProfile
  });
  /**
    @class

    @extends XM.Collection
  */
  XM.ShipViaCollection = XM.Collection.extend({
    /** @scope XM.ShipViaCollection.prototype */

    model: XM.ShipVia

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ShipChargeCollection = XM.Collection.extend({
    /** @scope XM.ShipChargeCollection.prototype */

    model: XM.ShipCharge

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ShipZoneCollection = XM.Collection.extend({
    /** @scope XM.ShipZoneCollection.prototype */

    model: XM.ShipZone

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerGroupCollection = XM.Collection.extend({
    /** @scope XM.CustomerGroupCollection.prototype */

    model: XM.CustomerGroup

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerProspectListItemCollection = XM.Collection.extend({
    /** @scope XM.CustomerProspectListItemCollection.prototype */

    model: XM.CustomerProspectListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerProspectRelationCollection = XM.Collection.extend({
    /** @scope XM.CustomerProspectRelationCollection.prototype */

    model: XM.CustomerProspectRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CustomerShiptoRelationCollection = XM.Collection.extend({
    /** @scope XM.CustomerProspectRelationCollection.prototype */

    model: XM.CustomerShiptoRelation

  });
}());
