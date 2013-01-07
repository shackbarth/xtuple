/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.IncidentCategory = XM.Document.extend({
    /** @scope XM.IncidentCategory.prototype */

    recordType: 'XM.IncidentCategory',

    documentKey: 'name',

    enforceUpperKey: false,

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ],

    orderAttribute: {
      orderBy: [{
        attribute: "order"
      }]
    }

  });

  /**
    @class

    @extends XM.Document
  */
  XM.IncidentSeverity = XM.Document.extend({
    /** @scope XM.IncidentSeverity.prototype */

    recordType: 'XM.IncidentSeverity',

    documentKey: 'name',

    enforceUpperKey: false,

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ],

    orderAttribute: {
      orderBy: [{
        attribute: "order"
      }]
    }
  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentResolution = XM.Document.extend({
    /** @scope XM.IncidentResolution.prototype */

    recordType: 'XM.IncidentResolution',

    documentKey: 'name',

    enforceUpperKey: false,

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ],

    orderAttribute: {
      orderBy: [{
        attribute: "order"
      }]
    }

  });

  /**
    @namespace

    A mixin shared by incident models that share common incident status
    functionality.
  */
  XM.IncidentStatus = {
    /** @scope XM.IncidentStatus */

    /**
    Returns incident status as a localized string.

    @returns {String}
    */
    getIncidentStatusString: function () {
      var K = XM.Incident,
        status = this.get('status');
      if (status === K.NEW) {
        return '_new'.loc();
      }
      if (status === K.FEEDBACK) {
        return '_feedback'.loc();
      }
      if (status === K.CONFIRMED) {
        return '_confirmed'.loc();
      }
      if (status === K.ASSIGNED) {
        return '_assigned'.loc();
      }
      if (status === K.RESOLVED) {
        return '_resolved'.loc();
      }
      if (status === K.CLOSED) {
        return '_closed'.loc();
      }
    },

    isActive: function () {
      var K = XM.Incident,
        status = this.get('status');
      return (status !== K.CLOSED);
    }

  };

  /**
    @class

    @extends XM.Document
  */
  XM.Incident = XM.Document.extend({
    /** @scope XM.Incident.prototype */

    recordType: 'XM.Incident',

    nameAttribute: "number",

    numberPolicy: XM.Document.AUTO_NUMBER,

    keyIsString: false,

    defaults: function () {
      return {
        owner: XM.currentUser,
        status: XM.Incident.NEW,
        isPublic: XT.session.getSettings().get("IncidentPublicDefault")
      };
    },

    requiredAttributes: [
      "account",
      "category",
      "contact",
      "description",
      "status"
    ],

    // ..........................................................
    // METHODS
    //

    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:assignedTo', this.assignedToDidChange);
    },

    assignedToDidChange: function (model, value, options) {
      var status = this.getStatus(),
        I = XM.Incident,
        K = XM.Model;
      if ((options && options.force) || !(status & K.READY)) { return; }
      if (value) { this.set('status', I.ASSIGNED); }
    },

    validateSave: function () {
      var K = XM.Incident;
      if (this.get('status') === K.ASSIGNED && !this.get('assignedTo')) {
        return XT.Error.clone('xt2001');
      }
    }

  });

  _.extend(XM.Incident, {
    /** @scope XM.Incident */

    /**
      New status.

      @static
      @constant
      @type String
      @default N
    */
    NEW: 'N',

    /**
      Feedback status.

      @static
      @constant
      @type String
      @default F
    */
    FEEDBACK: 'F',

    /**
      Confirmed Status.

      @static
      @constant
      @type String
      @default I
    */
    CONFIRMED: 'C',

    /**
      Assigned status.

      @static
      @constant
      @type String
      @default A
    */
    ASSIGNED: 'A',

    /**
      Resolved status.

      @static
      @constant
      @type String
      @default R
    */
    RESOLVED: 'R',

    /**
      Closed status.

      @static
      @constant
      @type String
      @default L
    */
    CLOSED: 'L'

  });

  // Incident status mixin
  XM.Incident = XM.Incident.extend(XM.IncidentStatus);

  /**
    @class

    @extends XM.Comment
  */
  XM.IncidentComment = XM.Comment.extend({
    /** @scope XM.IncidentComment.prototype */

    recordType: 'XM.IncidentComment',

    sourceName: 'INCDT'

  });

  /**
    @class

    @extends XM.Characteristic
  */
  XM.IncidentCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.IncidentCharacteristic.prototype */

    recordType: 'XM.IncidentCharacteristic'

  });

  /**
    @class

    @extends XM.Alarm
  */
  XM.IncidentAlarm = XM.Alarm.extend({
    /** @scope XM.IncidentAlarm.prototype */

    recordType: 'XM.IncidentAlarm'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentHistory = XM.Model.extend({
    /** @scope XM.IncidentAccount.prototype */

    recordType: 'XM.IncidentHistory'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentAccount = XM.Model.extend({
    /** @scope XM.IncidentAccount.prototype */

    recordType: 'XM.IncidentAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentContact = XM.Model.extend({
    /** @scope XM.IncidentContact.prototype */

    recordType: 'XM.IncidentContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentItem = XM.Model.extend({
    /** @scope XM.IncidentItem.prototype */

    recordType: 'XM.IncidentItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentFile = XM.Model.extend({
    /** @scope XM.IncidentFile.prototype */

    recordType: 'XM.IncidentFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentUrl = XM.Model.extend({
    /** @scope XM.IncidentUrl.prototype */

    recordType: 'XM.IncidentUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentIncident = XM.Model.extend({
    /** @scope XM.IncidentIncident.prototype */

    recordType: 'XM.IncidentIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentRecurrence = XM.Model.extend({
    /** @scope XM.IncidentRecurrence.prototype */

    recordType: 'XM.IncidentRecurrence'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.IncidentRelation = XM.Info.extend({
    /** @scope XM.IncidentRelation.prototype */

    recordType: 'XM.IncidentRelation',

    editableModel: 'XM.Incident'

  });

  // Incident status mixin
  XM.IncidentRelation = XM.IncidentRelation.extend(XM.IncidentStatus);

  /**
    @class

    @extends XM.Info
  */
  XM.IncidentListItem = XM.Info.extend({
    /** @scope XM.IncidentListItem.prototype */

    recordType: 'XM.IncidentListItem',

    editableModel: 'XM.Incident'

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.IncidentListItemCharacteristic = XM.Model.extend({
    /** @scope XM.IncidentListItemCharacteristic.prototype */

    recordType: 'XM.IncidentListItemCharacteristic'

  });

  // Incident status mixin
  XM.IncidentListItem = XM.IncidentListItem.extend(XM.IncidentStatus);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentCategoryCollection = XM.Collection.extend({
    /** @scope XM.IncidentCategoryCollection.prototype */

    model: XM.IncidentCategory

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentSeverityCollection = XM.Collection.extend({
    /** @scope XM.IncidentSeverityCollection.prototype */

    model: XM.IncidentSeverity

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentResolutionCollection = XM.Collection.extend({
    /** @scope XM.IncidentResolutionCollection.prototype */

    model: XM.IncidentResolution

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentListItemCollection = XM.Collection.extend({
    /** @scope XM.IncidentListItemCollection.prototype */

    model: XM.IncidentListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentRelationCollection = XM.Collection.extend({
    /** @scope XM.IncidentRelationCollection.prototype */

    model: XM.IncidentRelation

  });

}());

