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
        //site: probably the metric default
        //sale type: same
        quoteStatus: "Open"
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
      "items", //at least 1 line item?
      "customer",
      "miscCharge",
      "calculateFreight"
    ],
    
    // ..........................................................
    // METHODS
    //
    
    /**
      Initialize
    */
    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('add:item remove:item', this.itemsDidChange);
      //NOTE
      // this isn't supposed to be billtoName.  Should be like, billto or billtoNumber or something
      // this is how I had it before Steve upped 19453b
      this.on('change:billtoName', this.billtoNameDidChange);
      this.on('change:shiptoName', this.shiptoNameDidChange);
      var status = this.getStatus();
      if (!this.get("billtoName") && (status === XM.Model.READY_NEW)) {
        this.setReadOnly("items", true);
        this.setReadOnly("billtoName", true);
        this.setReadOnly("billtoAddress1", true);
        this.setReadOnly("billtoAddress2", true);
        this.setReadOnly("billtoAddress3", true);
        this.setReadOnly("billtoCity", true);
        this.setReadOnly("billtoState", true);
        this.setReadOnly("billtoPostalCode", true);
        this.setReadOnly("billtoPhone", true);
        this.setReadOnly("billtoContactHonorific", true);
        this.setReadOnly("billtoContactFirstName", true);
        this.setReadOnly("billtoContactMiddleName", true);
        this.setReadOnly("billtoContactLastName", true);
        this.setReadOnly("billtoContactSuffix", true);
        this.setReadOnly("billtoContactPhone", true);
        this.setReadOnly("billtoContactTitle", true);
        this.setReadOnly("billtoContactFax", true);
        this.setReadOnly("billtoContactEmail", true);
        this.setReadOnly("shiptoName", true);
        this.setReadOnly("shiptoAddress1", true);
        this.setReadOnly("shiptoAddress2", true);
        this.setReadOnly("shiptoAddress3", true);
        this.setReadOnly("shiptoCity", true);
        this.setReadOnly("shiptoState", true);
        this.setReadOnly("shiptoPostalCode", true);
        this.setReadOnly("shiptoPhone", true);
        this.setReadOnly("shiptoContactHonorific", true);
        this.setReadOnly("shiptoContactFirstName", true);
        this.setReadOnly("shiptoContactMiddleName", true);
        this.setReadOnly("shiptoContactLastName", true);
        this.setReadOnly("shiptoContactSuffix", true);
        this.setReadOnly("shiptoContactPhone", true);
        this.setReadOnly("shiptoContactTitle", true);
        this.setReadOnly("shiptoContactFax", true);
        this.setReadOnly("shiptoContactEmail", true);
      }
    },
    
    /**
      itemsDidChange
      
      Used to update calculated fiels.
      Called when the user adds or removes a line item.
    */
    itemsDidChange: function (model, value, options) {
      var that = this,
        changed;
      //this.margin = 0.0;
      //this.freightWeight = 0.0;
      this.subtotal = 0.0;
      this.tax = 0.0;
      this.total = 0.0;

      //Total up everything
      _.each(this.get('items').models, function (item) {
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
      billtoContactDidChange
    */
    billtoNameDidChange: function (model, value, options) {
      var status = this.getStatus();
      
      //need to do model fetching stuff that populates the other stuff
      
      if (!this.get("billtoName") && (status !== XM.Model.READY_NEW)) {
        this.setReadOnly("items", false);
        this.setReadOnly("billtoName", false);
        this.setReadOnly("billtoAddress1", false);
        this.setReadOnly("billtoAddress2", false);
        this.setReadOnly("billtoAddress3", false);
        this.setReadOnly("billtoCity", false);
        this.setReadOnly("billtoState", false);
        this.setReadOnly("billtoPostalCode", false);
        this.setReadOnly("billtoPhone", false);
        this.setReadOnly("billtoContactHonorific", false);
        this.setReadOnly("billtoContactFirstName", false);
        this.setReadOnly("billtoContactMiddleName", false);
        this.setReadOnly("billtoContactLastName", false);
        this.setReadOnly("billtoContactSuffix", false);
        this.setReadOnly("billtoContactPhone", false);
        this.setReadOnly("billtoContactTitle", false);
        this.setReadOnly("billtoContactFax", false);
        this.setReadOnly("billtoContactEmail", false);
        this.setReadOnly("shiptoName", false);
        this.setReadOnly("shiptoAddress1", false);
        this.setReadOnly("shiptoAddress2", false);
        this.setReadOnly("shiptoAddress3", false);
        this.setReadOnly("shiptoCity", false);
        this.setReadOnly("shiptoState", false);
        this.setReadOnly("shiptoPostalCode", false);
        this.setReadOnly("shiptoPhone", false);
        this.setReadOnly("shiptoContactHonorific", false);
        this.setReadOnly("shiptoContactFirstName", false);
        this.setReadOnly("shiptoContactMiddleName", false);
        this.setReadOnly("shiptoContactLastName", false);
        this.setReadOnly("shiptoContactSuffix", false);
        this.setReadOnly("shiptoContactPhone", false);
        this.setReadOnly("shiptoContactTitle", false);
        this.setReadOnly("shiptoContactFax", false);
        this.setReadOnly("shiptoContactEmail", false);
      }
        
    },
    
    /**
      shiptoContactDidChange
    */
    shiptoNameDidChange: function (model, value, options) {

    },
    
    /**
      copyBilltoToShipto
    */
    copyBilltoToShipto: function (model, value, options) {
      //need to do model fetching stuff that populates the other stuff
      this.set("shiptoName", this.get("billtoName"));
      this.set("shiptoAddress1", this.get("billtoAddress1"));
      this.set("shiptoAddress2", this.get("billtoAddress2"));
      this.set("shiptoAddress3", this.get("billtoAddress3"));
      this.set("shiptoCity", this.get("billtoCity"));
      this.set("shiptoState", this.get("billtoState"));
      this.set("shiptoPostalCode", this.get("billtoPostalCode"));
      this.set("shiptoPhone", this.get("billtoPhone"));
      this.set("shiptoContactHonorific", this.get("billtoContactHonorific"));
      this.set("shiptoContactFirstName", this.get("billtoContactFirstName"));
      this.set("shiptoContactMiddleName", this.get("billtoContactMiddleName"));
      this.set("shiptoContactLastName", this.get("billtoContactLastName"));
      this.set("shiptoContactSuffix", this.get("billtoContactSuffix"));
      this.set("shiptoContactPhone", this.get("billtoContactPhone"));
      this.set("shiptoContactTitle", this.get("billtoContactTitle"));
      this.set("shiptoContactFax", this.get("billtoContactFax"));
      this.set("shiptoContactEmail", this.get("billtoContactEmail"));
    }
    
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
  
  /**
    @class

    @extends XM.Collection
  */
  XM.QuoteSiteCollection = XM.Collection.extend({
    /** @scope XM.QuoteSiteCollection.prototype */

    model: XM.QuoteSite

  });
  
  /**
    @class

    @extends XM.Collection
  */
  XM.QuoteSaleTypeCollection = XM.Collection.extend({
    /** @scope XM.QuoteSaleTypeCollection.prototype */

    model: XM.QuoteSaleType

  });

}());
