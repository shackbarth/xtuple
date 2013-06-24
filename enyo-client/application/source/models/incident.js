/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true, console:true */

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

    defaults: function () {
      return {
        owner: XM.currentUser,
        status: XM.Incident.NEW,
        isPublic: XT.session.getSettings().get("IncidentPublicDefault"),
        created: new Date()
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
      if (value) { this.set('status', XM.Incident.ASSIGNED); }
    },

    validate: function () {
      var K = XM.Incident;
      if (this.get('status') === K.ASSIGNED && !this.get('assignedTo')) {
        return XT.Error.clone('xt2001');
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    },

    save: function (key, value, options) {
      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        options = value;
      }
      options = options ? _.clone(options) : {};

      var success = options.success,
        status = this.getStatus(),
        statusString = this.getIncidentStatusString() ? this.getIncidentStatusString().toUpperCase() : undefined,
        isNotUpdated = _.size(this.prime) === 0,
        newComment = _.find(this.get('comments').models, function (comment) {
          return comment.getStatus() === XM.Model.READY_NEW;
        });

      options.success = function (model, resp, options) {
        var profile = model.getValue("category.emailProfile"),
          formattedContent = {},
          emailOptions = {error: function () {
            XT.log("Error sending email with incident details");
          }},
          format = function (str) {
            str = str || "";
            var parser = /\{([^}]+)\}/g, // Finds curly braces
              tokens,
              attr;
            tokens = str.match(parser);
            _.each(tokens, function (token) {
              attr = token.slice(1, token.indexOf('}'));
              str = str.replace(token, model.getValue(attr));
            });
            return str;
          };

        if (profile && profile.attributes) {
          // this profile model has pretty much exactly the right key/value pairs so
          // we can pass it straight to node. We do want to perform the "format" transform
          // on all of the values on the object.
          _.each(profile.attributes, function (value, key, list) {
            if (typeof value === 'string') {
              formattedContent[key] = format(value);
            }
          });

          XT.dataSource.sendEmail(formattedContent, emailOptions);
        } // else there's no email profile profiled

        if (success) { success(model, resp, options); }
      };

      // Set change text
      if (status === XM.Model.READY_NEW && this.get('status') !== 'N') {
        this._lastChange = "_incidentCreatedStatus".loc()
                                                   .replace("{status}", statusString);
      } else if (status === XM.Model.READY_NEW) {
        this._lastChange = "_incidentCreated".loc();
      } else if (this.original('status') !== this.get('status')) {
        this._lastChange = "_incidentChangedStatus".loc()
                                                   .replace("{status}", statusString);
      } else if (newComment && isNotUpdated) {
        this._lastChange = "_incidentNewComment".loc();
      } else {
        this._lastChange = "_incidentUpdated".loc();
      }
      this._lastChange += ":";

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || _.isEmpty(key)) {
        value = options;
      }

      XM.Document.prototype.save.call(this, key, value, options);
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

  // email-relevant mixin
  XM.Incident = XM.Incident.extend({

    getChangeString: function () {
      return this._lastChange;
    },

    getLastCommentString: function () {
      var comments = this.get('comments'),
        // public comments is an array even though comments is a collection
        publicComments = comments.filter(function (comment) {
          return comment.get("isPublic");
        }),
        comment,
        ret = "";

      if (publicComments.length) {
        // Sort by date descending and take first
        publicComments = _.sortBy(publicComments, function (comment) {
          return -1 * comment.get('created').getTime();
        });
        comment = publicComments[0];
        ret = "_latestComment".loc() +
              " (" + comment.get('createdBy') + ")" +
              "\n\n" +
              comment.get('text');
      }
      return ret;
    },

    getHistoryString: function () {
      var history = this.get('history'),
        ret = "",
        isFirst = true;
      if (history.length) {
        // Sort by date ascending
        history.comparator = function (a, b) {
          var aval = a.get('created'),
            bval = b.get('created');
          return XT.date.compare(aval, bval);
        };
        history.sort();
        _.each(history.models, function (model) {
          var offset = (new Date()).getTimezoneOffset(), // hack: the data should include timezone
            created = new Date(model.get('created').getTime() + offset * 60 * 1000),
            fdate = Globalize.format(created, "d"),
            ftime = Globalize.format(created, "t");
          if (!isFirst) { ret += "\n"; }
          isFirst = false;
          ret += (fdate + ' ' + ftime).rightPad(' ', 24);
          ret += model.get('createdBy').slice(0, 17).rightPad(' ', 18);
          ret += model.get('description');
        });
      }
      return ret;
    }
  });

  /**
    @class

    @extends XM.Comment
  */
  XM.IncidentComment = XM.Comment.extend({
    /** @scope XM.IncidentComment.prototype */

    recordType: 'XM.IncidentComment',

    sourceName: 'INCDT',

    defaults: function () {
      var result = XM.Comment.prototype.defaults.apply(this, arguments),
        publicDefault = XT.session.getSettings().get('IncidentPublicDefault');

      result.isPublic = publicDefault || false;
      return result;
    }

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

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentEmailProfile = XM.Document.extend(
    /** @scope XM.IncidentEmailProfile.prototype */ {

    recordType: 'XM.IncidentEmailProfile',

    documentKey: 'name'

  });

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

  /**
    @class

    @extends XM.Collection
  */
  XM.IncidentEmailProfileCollection = XM.Collection.extend({
    /** @scope XM.IncidentEmailProfileCollection.prototype */

    model: XM.IncidentEmailProfile

  });
}());

