/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
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

    privileges: {
      "all": {
        "create": "MaintainIncidentCategories",
        "read": true,
        "update": "MaintainIncidentCategories",
        "delete": "MaintainIncidentCategories"
      }
    },

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ]

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

    privileges: {
      "all": {
        "create": "MaintainIncidentSeverities",
        "read": true,
        "update": "MaintainIncidentSeverities",
        "delete": "MaintainIncidentSeverities"
      }
    },

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentResolution = XT.Model.extend({
    /** @scope XM.IncidentResolution.prototype */

    recordType: 'XM.IncidentResolution',

    documentKey: 'name',

    enforceUpperKey: false,

    privileges: {
      "all": {
        "create": "MaintainIncidentResolutions",
        "read": true,
        "update": "MaintainIncidentResolutions",
        "delete": "MaintainIncidentResolutions"
      }
    },

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ]

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
    }

  };
  
  /**
    @class
  
    @extends XM.Document
  */
  XM.Incident = XM.Document.extend({
    /** @scope XM.Incident.prototype */

    recordType: 'XM.Incident',
    
    numberPolicy: XM.Document.AUTO_NUMBER,
    
    keyIsString: false,

    privileges: {
      "all": {
        "create": "MaintainAllIncidents",
        "read": "ViewAllIncidents",
        "update": "MaintainAllIncidents",
        "delete": "MaintainAllIncidents"
      },
      "personal": {
        "create": "MaintainPersonalIncidents",
        "read": "ViewPersonalIncidents",
        "update": "MaintainPersonalIncidents",
        "delete": "MaintainPersonalIncidents",
        "properties": [
          "owner",
          "assignedTo"
        ]
      }
    },
    
    defaults: function () {
      return {
        owner: XM.currentUser,
        status: XM.Incident.NEW
      };
    },
    
    requiredAttributes: [
      "account",
      "category",
      "contact",
      "description"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'assignedTo',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'item',
      relatedModel: 'XM.ItemInfo'
    }, {
      type: Backbone.HasOne,
      key: 'priority',
      relatedModel: 'XM.Priority',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'category',
      relatedModel: 'XM.IncidentCategory',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'severity',
      relatedModel: 'XM.IncidentSeverity',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'resolution',
      relatedModel: 'XM.IncidentResolution',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: 'XM.IncidentComment',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'characteristics',
      relatedModel: 'XM.IncidentCharacteristic',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'alarms',
      relatedModel: 'XM.IncidentAlarm',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'history',
      relatedModel: 'XM.IncidentHistory',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'accounts',
      relatedModel: 'XM.IncidentAccount',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'contacts',
      relatedModel: 'XM.IncidentContact',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'items',
      relatedModel: 'XM.IncidentItem',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'files',
      relatedModel: 'XM.IncidentFile',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'images',
      relatedModel: 'XM.IncidentImage',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'urls',
      relatedModel: 'XM.IncidentUrl',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'incidents',
      relatedModel: 'XM.IncidentIncident',
      reverseRelation: {
        key: 'incident'
      }
    }, {
      type: Backbone.HasMany,
      key: 'recurrences',
      relatedModel: 'XM.IncidentRecurrence',
      reverseRelation: {
        key: 'incident'
      }
    }],
    
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
        K = XT.Model;
      if (options && options.force || !(status & K.READY)) { return; }
      if (value) { this.set('incidentStatus', I.ASSIGNED); }
    },
    
    validateSave: function () {
      var K = XM.Incident;
      if (this.get('status') === K.ASSIGNED && !this.get('assignedTo')) {
        return "_assignedToRequiredAssigned".loc();
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

    recordType: 'XM.IncidentComment'

  });
  
  /**
    @class
  
    @extends XM.Characteristic
  */
  XM.IncidentCharacteristic = XM.Characteristic.extend({
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
  
    @extends XT.Model
  */
  XM.IncidentHistory = XT.Model.extend({
    /** @scope XM.IncidentAccount.prototype */

    recordType: 'XM.IncidentHistory'

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentAccount = XT.Model.extend({
    /** @scope XM.IncidentAccount.prototype */

    recordType: 'XM.IncidentAccount',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentContact = XT.Model.extend({
    /** @scope XM.IncidentContact.prototype */

    recordType: 'XM.IncidentContact',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentItem = XT.Model.extend({
    /** @scope XM.IncidentItem.prototype */

    recordType: 'XM.IncidentItem',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'item',
      relatedModel: 'XM.ItemInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentFile = XT.Model.extend({
    /** @scope XM.IncidentFile.prototype */

    recordType: 'XM.IncidentFile',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'file',
      relatedModel: 'XM.FileInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentImage = XT.Model.extend({
    /** @scope XM.IncidentImage.prototype */

    recordType: 'XM.IncidentImage',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'image',
      relatedModel: 'XM.ImageInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentUrl = XT.Model.extend({
    /** @scope XM.IncidentUrl.prototype */

    recordType: 'XM.IncidentUrl',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'url',
      relatedModel: 'XM.Url'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentIncident = XT.Model.extend({
    /** @scope XM.IncidentIncident.prototype */

    recordType: 'XM.IncidentIncident',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'Incident',
      relatedModel: 'XM.IncidentInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentRecurrence = XT.Model.extend({
    /** @scope XM.IncidentRecurrence.prototype */

    recordType: 'XM.IncidentRecurrence'

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.IncidentInfo = XT.Model.extend({
    /** @scope XM.IncidentInfo.prototype */

    recordType: 'XM.IncidentInfo',
    
    readOnly: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'assignedTo',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'priority',
      relatedModel: 'XM.Priority',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'category',
      relatedModel: 'XM.IncidentCategory',
      includeInJSON: 'guid'
    }]

  });
  
  // Incident status mixin
  XM.IncidentInfo = XM.IncidentInfo.extend(XM.IncidentStatus);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
  
    @extends XT.Collection
  */
  XM.IncidentCategoryCollection = XT.Collection.extend({
    /** @scope XM.IncidentCategoryCollection.prototype */

    model: XM.IncidentCategory

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.IncidentSeverityCollection = XT.Collection.extend({
    /** @scope XM.IncidentSeverityCollection.prototype */

    model: XM.IncidentSeverity

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.IncidentResolutionCollection = XT.Collection.extend({
    /** @scope XM.IncidentResolutionCollection.prototype */

    model: XM.IncidentResolution

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.IncidentInfoCollection = XT.Collection.extend({
    /** @scope XM.IncidentInfoCollection.prototype */

    model: XM.IncidentInfo

  });

}());

