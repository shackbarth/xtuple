/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Customer = XM.AccountDocument.extend({
    /** @scope XM.Customer.prototype */

    recordType: 'XM.Customer',

    defaults: function () {
      var localCurrency,
          currencyModel,
          settings = XT.session.getSettings();
      for (var i = 0; i < XM.currencies.models.length; i++) {
        currencyModel = XM.currencies.models[i];
        if (currencyModel.attributes.isBase) {
          localCurrency = currencyModel;
        }
      }
      return {
        isActive: true,
        creditStatus: "G",
        currency: localCurrency,
        salesRep: settings.get("DefaultSalesRep"),
        terms: settings.get("DefaultTerms"),
        shipVia: settings.get("DefaultShipViaId"),
        customerType: settings.get("DefaultCustType"),
        backorder: settings.get("DefaultBackOrders") || false,
        partialShip: settings.get("DefaultPartialShipments") || false,
        isFreeFormShipto: settings.get("DefaultFreeFormShiptos") || false,
        autoUpdateStatus: false,
        autoHoldOrders: false,
        isFreeFormBillto: false,
        commission: 0,
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
    
    requiredAttributes: [
      "isActive",
      "name",
      "number",
      "customerType",
      "terms",
      "salesRep",
      "backorder",
      "partialShip",
      "discount",
      "balanceMethod",
      "isFreeFormShipto",
      "blanketPurchaseOrders",
      "shipCharge",
      "creditStatus",
      "isFreeFormBillto",
      "usesPurchaseOrders",
      "autoUpdateStatus",
      "autoHoldOrders"
    ],
    
    // ..........................................................
    // METHODS
    //
    
    /**
      Initialize
    */
    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:usesPurchaseOrders', this.purchaseOrdersDidChange);
      this.on('change:backorder', this.backorderDidChange);
      this.on('change:salesRep', this.salesRepDidChange);
    },
    
    purchaseOrdersDidChange: function () {
      if (this.get("usesPurchaseOrders")) {
        this.setReadOnly("blanketPurchaseOrders", false);
      } else if (!this.get("usesPurchaseOrders")) {
        this.set("blanketPurchaseOrders", false);
        this.setReadOnly("blanketPurchaseOrders", true);
      }
    },
    
    backorderDidChange: function () {
      if (this.get("backorder")) {
        this.setReadOnly("partialShip", false);
      } else if (!this.get("backorder")) {
        this.set("partialShip", false);
        this.setReadOnly("partialShip", true);
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
      Creates a new account model and fetches based on the given ID.
      Takes attributes from the account model and gives them to this customer model.
    */
    convertFromAccount: function (id) {
      var account = new XM.Account(),
          fetchOptions = {},
          that = this;

      fetchOptions.id = id;
      
      fetchOptions.success = function (resp) {
        that.set("name", account.get("name"));
        that.set("billingContact", account.get("primaryContact"));
        that.set("correspondenceContact", account.get("secondaryContact"));
        that.revertStatus();
        that._number = that.get('number');
      };
      fetchOptions.error = function (resp) {
        XT.log("Fetch failed in convertFromAccount");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      account.fetch(fetchOptions);
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

      fetchOptions.id = id;

      fetchOptions.success = function (resp) {
        that.set("name", prospect.get("name"));
        that.set("billingContact", prospect.get("contact"));
        that.set("salesRep", prospect.get("salesRep"));
        that.set("preferredSite", prospect.get("site"));
        that.set("taxZone", prospect.get("taxZone"));
        that.setReadOnly("id", false);
        that.set("id", prospect.get("id"));
        that.setReadOnly("id", true);
        that.revertStatus();
        that._number = that.get('number');
      };
      fetchOptions.error = function (resp) {
        XT.log("Fetch failed in convertFromProspect");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      prospect.fetch(fetchOptions);
    }

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

    recordType: 'XM.CustomerCharacteristic'

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

    @extends XM.Model
  */
  XM.CustomerGroup = XM.Model.extend({
    /** @scope XM.CustomerGroup.prototype */
    
    recordType: 'XM.CustomerGroup',
    
    documentKey: 'name'
    
  });

  /**
    @class

    @extends XM.Model
  */
  XM.CustomerShipto = XM.Document.extend({
    /** @scope XM.CustomerShipto.prototype */

    recordType: 'XM.CustomerShipto',
    
    requiredAttributes: [
      "isActive",
      "name",
      "number"
    ],
    
    // ..........................................................
    // METHODS
    //

    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:customer', this.customerDidChange);
      this.on('change:salesRep', this.salesRepDidChange);
    },

    customerDidChange: function (model, value, options) {
      var status = this.getStatus(),
        customer = this.get("customer"),
        K = XM.Model,
        numberArray = [],
        shiptosCollection;

      if (customer && status === K.READY_NEW) {
        if (!this.get("number")) {
          shiptosCollection = customer.get("shiptos");
          
          //map the number attr of each model in the shiptosCollection to numberArray
          numberArray = _.map(shiptosCollection.models, function (m) {return m.get("number"); });
          /* The purpose of the next few lines is to automatically find the next integer number for the new shipto.
              Sticking a + sign in front of a string will return the number version of the string as long as the
              string contains only numbers.  If it contains non-numeric characters, it will return NaN (not a number).
              For example, +"5" will return 5.  But +"shipto5" would return NaN.  So this while loop will continue to
              loop as long as the string numberArray[i] contains only numeric characters.
          */
          numberArray.sort();
          var i = 0,
              j = 0;
          while (!isNaN(+numberArray[i])) {
            i++;
            j = numberArray[i];
          }
          this.set("number", j + 1);
        }
        
        // Set defaults from customer
        this.set("salesRep", customer.get("salesRep"));
        this.set("shipZone", customer.get("shipZone"));
        this.set("taxZone", customer.get("taxZone"));
        this.set("shipVia", customer.get("shipVia"));
        this.set("shipCharge", customer.get("shipCharge"));
      }
    },
    
    salesRepDidChange: function () {
      var salesRep = this.get('salesRep');
      if (salesRep && (this.getStatus() & XM.Model.READY)) {
        this.set('commission', salesRep.get('commission'));
      }
    }

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

    documentKey: 'code'

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

    documentKey: 'name'

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.ShippingForm = XM.Document.extend({
    /** @scope */

    recordType: 'XM.ShippingForm',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ShipVia = XM.Document.extend({
    /** @scope XM.CustomerVia.prototype */

    recordType: 'XM.ShipVia',

    documentKey: 'code'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ShipZone = XM.Document.extend({
    /** @scope XM.ShipZone.prototype */

    recordType: 'XM.ShipZone',

    documentKey: 'name'

  });
  
  // ..........................................................
  // COLLECTIONS
  //

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
  XM.ShippingFormCollection = XM.Collection.extend({
    /** @scope XM.ShippingFormCollection.prototype */

    model: XM.ShippingForm

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ShipZoneCollection = XM.Collection.extend({
    /** @scope XM.ShipZoneCollection.prototype */

    model: XM.ShipZone

  });
  
}());
