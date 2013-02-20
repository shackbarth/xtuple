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
        status: "Open"
        //shipping zone: probably the metric default
      };
    },
/*
    readOnlyAttributes: [
      when customer# or shipto# are not filled, then all of the corresponding address stuff is read only.
        also the contact name.
      the "new" button on line items is read only when customer is blank.
    ],
*/
    requiredAttributes: [
      "id",
      "number",
      "quoteDate",
      //at least 1 line item?
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
  
  /**
    @class

    @extends XM.Model
  */
  XM.QuoteCustomer = XM.Model.extend({
    /** @scope XM.QuoteCustomer.prototype */

    recordType: 'XM.QuoteCustomer',

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
    
    @extends XM.Model
  */
  XM.QuoteToDo = XM.Document.extend({
    /** @scope XM.QuoteToDo */
    
    recordType: 'XM.QuoteToDo',
    
    documentKey: 'number'
    
  });

}());
