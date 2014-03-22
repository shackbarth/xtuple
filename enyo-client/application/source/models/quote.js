/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.SalesOrderBase
    @extends XM.SalesOrderBaseMixin
  */
  XM.Quote = XM.SalesOrderBase.extend(/** @lends XM.Quote.prototype */{

    recordType: 'XM.Quote',

    nameAttribute: 'number',

    numberPolicySetting: 'QUNumberGeneration',

    // quote has its own very special dispatch function for fetchNumber
    fetchNumberDispatchModel: "XM.Quote",

    documentDateKey: "quoteDate"

  });

  XM.QuoteLine = XM.Model.extend(_.extend({}, XM.OrderLineMixin,
      XM.SalesOrderBaseMixin, XM.SalesOrderLineMixin, {

    recordType: 'XM.QuoteLine',

    parentKey: "quote",

    lineCharacteristicRecordType: "XM.QuoteLineCharacteristic",

    isActive: function () {
      this.getValue("quote.isActive");
    }

  }), XM.SalesOrderLineStaticMixin);

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

    editableModel: 'XM.Quote',

  });

  // Add in quote mixin
  XM.QuoteListItem = XM.QuoteListItem.extend(XM.SalesOrderBaseMixin);

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
