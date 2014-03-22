/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.OpportunityType = XM.Document.extend({
    /** @scope XM.OpportunityType.prototype */

    recordType: 'XM.OpportunityType',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.OpportunityStage = XM.Document.extend({
    /** @scope XM.OpportunityStage.prototype */

    recordType: 'XM.OpportunityStage',

    documentKey: 'name',

    defaults: {
      deactivate: false
    }

  });

  /**
    @class

    @extends XM.Document
  */
  XM.OpportunitySource = XM.Document.extend({
    /** @scope XM.OpportunitySource.prototype */

    recordType: 'XM.OpportunitySource',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Opportunity = XM.Document.extend({
    /** @scope XM.Opportunity.prototype */

    recordType: 'XM.Opportunity',

    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        owner: XM.currentUser,
        isActive: true,
        currency: XT.baseCurrency()
      };
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:assignedTo', this.assignedToDidChange);
    },

    assignedToDidChange: function (model, value, options) {
      var assignedTo,
        assignDate;
      if (this.isNotRead()) { return; }

      // Set the assign date if it hasn't been already
      assignedTo = this.get('assignedTo');
      assignDate = this.get('assignDate');
      if (assignedTo && !assignDate) {
        this.set('assignDate', new Date());
      }
    }

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.OpportunityComment = XM.Comment.extend({
    /** @scope XM.OpportunityComment.prototype */

    recordType: 'XM.OpportunityComment',

    sourceName: 'OPP'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.OpportunityCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.OpportunityCharacteristic.prototype */

    recordType: 'XM.OpportunityCharacteristic',

    which: 'isOpportunities'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityAccount = XM.Model.extend({
    /** @scope XM.OpportunityAccount.prototype */

    recordType: 'XM.OpportunityAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityContact = XM.Model.extend({
    /** @scope XM.OpportunityContact.prototype */

    recordType: 'XM.OpportunityContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityItem = XM.Model.extend({
    /** @scope XM.OpportunityItem.prototype */

    recordType: 'XM.OpportunityItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityFile = XM.Model.extend({
    /** @scope XM.OpportunityFile.prototype */

    recordType: 'XM.OpportunityFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityUrl = XM.Model.extend({
    /** @scope XM.OpportunityUrl.prototype */

    recordType: 'XM.OpportunityUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityOpportunity = XM.Model.extend({
    /** @scope XM.OpportunityOpportunity.prototype */

    recordType: 'XM.OpportunityOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    Same as `XM.OpportunityInfo` but less data.

    @extends XM.Info
  */
  XM.OpportunityRelation = XM.Info.extend({
    /** @scope XM.OpportunityRelation.prototype */

    recordType: 'XM.OpportunityRelation',

    editableModel: 'XM.Opportunity'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.OpportunityListItem = XM.Info.extend({
    /** @scope XM.OpportunityListItem.prototype */

    recordType: 'XM.OpportunityListItem',

    editableModel: 'XM.Opportunity'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityListItemCharacteristic = XM.Model.extend({
    /** @scope XM.OpportunityListItemCharacteristic.prototype */

    recordType: 'XM.OpportunityListItemCharacteristic'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.OpportunityTypeCollection = XM.Collection.extend({
    /** @scope XM.OpportunityTypeCollection.prototype */

    model: XM.OpportunityType

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.OpportunityStageCollection = XM.Collection.extend({
    /** @scope XM.OpportunityStageCollection.prototype */

    model: XM.OpportunityStage

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.OpportunitySourceCollection = XM.Collection.extend({
    /** @scope XM.OpportunitySourceCollection.prototype */

    model: XM.OpportunitySource

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.OpportunityListItemCollection = XM.Collection.extend({
    /** @scope XM.OpportunityListItemCollection.prototype */

    model: XM.OpportunityListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.OpportunityRelationCollection = XM.Collection.extend({
    /** @scope XM.OpportunityRelationCollection.prototype */

    model: XM.OpportunityRelation

  });

}());
