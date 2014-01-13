/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class Use this mixin for setting up document associations.
    @name XM.DocumentAssignmentsMixin
  */
  XM.DocumentAssignmentsMixin = {

    /**
      A mapping of attributes whose values have been mapped to another property.
    */
    attributeDelegates: null,

    /**
      A collection of mixed document assignment models that converges all model relations
      where the related model prototype `isDocumentAssignment` property is true.
    */
    documents: null,

    /**
      Iterate through relations on a model looking for `isDocumentAssignment`
      and bind those relations to a consolidated documents collection. Also
      adds to a map called `attributeDelegates` that records attributes being
      mapped to this new alternate property.

      Should be called in the `initialize` function.

      @param {XM.Model} Model
    */
    bindDocuments: function () {
      var model = this,
        relations = model.getRelations(),
        collection;
      model.attributeDelegates = model.attributeDelegates || {};
      model.documents = new Backbone.Collection();
      model.documents.parent = this;
      _.each(relations, function (relation) {
        if (relation.relatedModel.prototype.isDocumentAssignment) {
          model.attributeDelegates[relation.key] = 'documents';
          collection = model.get(relation.key);
          collection.on('relational:add', model.documentAdded, model);
          collection.on('relational:remove', model.documentRemoved, model);
        }
      });
    },

    documentAdded: function (model) {
      this.documents.add(model);
    },

    documentRemoved: function (model) {
      this.documents.remove(model);
    }

  };

  /**
    @class Includes functionality common to xTuple documents uniquely identified by
    a user accessible `documentKey'.
    @name XM.Document
    @extends XM.Model
    @extends XM.DocumentAssignmentsMixin
  */
  XM.Document = XM.Model.extend(/** @lends XM.Document# */{

    /**
      The unique property for the document, typically a number, code or name.
      This property will be checked when a user edits it to ensure it has not already
      been used by another record of the same type.

      @default number
      @type {String}
    */
    documentKey: 'number',

    /**
      Forces the document key to always be uppercase.

      @type {Boolean}
      @default true
    */
    enforceUpperKey: true,

    /**
      Converts auto numbered keys to strings.

      @type {Boolean}
      @default true
    */
    keyIsString: true,

    /**
      Number generation method for the document key that can be one of three constants:<br />
        XM.Document.MANUAL_NUMBER<br />
        XM.Document.AUTO_NUMBER<br />
        XM.Document.AUTO_OVERRIDE_NUMBER<br />

      Can be inferred from the setting that controls this for a given record type
      if it is set.

      @seealso `numberPolicySetting`
      @type {String}
      @default XT.MANUAL_NUMBER
    */
    numberPolicy: null,

    /**
      If set, the number Policy property will be set based on the number
      generation policy on this setting.

      @seealso `numberPolicy`
      @type {String}
    */
    numberPolicySetting: null,

    /**
      Check for conflicts on an already used document key when the key changes
      and on save.
    */
    checkConflicts: true,

    /**
      Used when converting from an account to the subclass. No need to include
      the document key which is automatically accounted for.
    */
    conversionMap: {
      name: "name"
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);

      // Bind events
      this.on('change:' + this.documentKey, this.documentKeyDidChange);
      this.on('statusChange', this.statusDidChange);

      // Bind document assignments
      this.bindDocuments();
    },

    destroy: function () {
      var K = XM.Model,
        status = this.getStatus();

      /* release the number if applicable */
      if (status === K.READY_NEW && this._number) {
        this.releaseNumber();
      }
      XM.Model.prototype.destroy.apply(this, arguments);
    },

    documentKeyDidChange: function (model, value, options) {
      var K = XM.Model,
        that = this,
        status = this.getStatus(),
        upper = value;
      options = options || {};
      if (this.keyIsString && value && value.toUpperCase) {
        upper = upper.toUpperCase();
      }

      // Handle uppercase
      if (this.enforceUpperKey && value !== upper) {
        this.set(this.documentKey, upper);
        return;  // Will check again on next pass
      }

      // Release the fetched number if applicable
      if (status === K.READY_NEW && this._number && this._number !== value) {
        this.releaseNumber();
      }

      // Check for conflicts
      if (value && this.isDirty() && !this._number && this.checkConflicts) {
        options.success = function (resp) {
          var err, params = {};
          if (resp) {
            params.attr = ("_" + that.documentKey).loc();
            params.value = value;
            params.response = resp;
            err = XT.Error.clone('xt1008', { params: params });
            that.trigger('invalid', that, err, options);
          }
        };
        this.findExisting(this.documentKey, value, options);
      }
    },

    initialize: function (attributes, options) {
      XM.Model.prototype.initialize.call(this, attributes, options);
      var K = XM.Document,
        policy;
      attributes = attributes || {};

      // Set number policy if not already set
      if (!this.numberPolicy) {
        if (this.numberPolicySetting) {
          policy = XT.session.getSettings().get(this.numberPolicySetting);
        }
        this.numberPolicy =  policy || K.MANUAL_NUMBER;
      }

      // Fetch number if auto
      if (options && options.isNew &&
         _.isEmpty(attributes[this.documentKey]) &&
         (this.numberPolicy === K.AUTO_NUMBER ||
          this.numberPolicy === K.AUTO_OVERRIDE_NUMBER)) {
        this.fetchNumber();
      }

      // Make document key required
      if (!_.contains(this.requiredAttributes, this.documentKey)) {
        this.requiredAttributes.push(this.documentKey);
      }
    },

    /**
      A utility function to sets the next sequential number on a record.

      The function will send the class name property of itself to the server
      which will cross reference the ORM 'orderSequence' property for the class
      to determine which sequence to use.

      @returns {Object} Receiver
    */
    fetchNumber: function () {
      var that = this,
        options = {},
        D = XM.Document;
      options.success = function (resp) {
        // Make sure a number didn't get set while we were waiting
        if (_.isEmpty(that.get(that.documentKey))) {
          that._number = that.keyIsString && resp.toString() ?
              resp.toString() : (!that.keyIsString && !_.isNaN(resp) ? resp - 0 : resp);
          that.set(that.documentKey, that._number);
        }
        if (that.numberPolicy === D.AUTO_NUMBER) {
          that.setReadOnly(that.documentKey);
        }
      };
      this.dispatch('XM.Model', 'fetchNumber',
                             this.recordType, options);
      return this;
    },

    /**
      Releases a number back into the number pool for the record type. Usually
      would happen when user cancels without saving a new record.

      The function will send the class name property of itself to the server
      which will cross reference the ORM 'orderSequence' property for the class
      to determine which sequence to use.

      @returns {Object} Receiver
    */
    releaseNumber: function () {
      this.dispatch('XM.Model', 'releaseNumber',
                             [this.recordType, this._number]);
      this._number = null;
      return this;
    },

    /**
      This version of `save` first checks to see if the document key already
      exists before committing.
    */
    save: function (key, value, options) {
      var that = this,
        K = XM.Model,
        currValue = this.get(this.documentKey),
        origValue = this.original(this.documentKey),
        status = this.getStatus(),
        checkOptions = {};

      // Check for number conflicts if we should
      if ((this.checkConflicts &&
          (status === K.READY_NEW && currValue && !this._number) ||
          (status === K.READY_DIRTY && currValue !== origValue))) {
        checkOptions.success = function (resp) {
          var err, params = {};
          if (resp === 0) {
            XM.Model.prototype.save.call(that, key, value, options);
          } else {
            params.attr = ("_" + that.documentKey).loc();
            params.value = currValue;
            params.response = resp;
            err = XT.Error.clone('xt1008', { params: params });
            that.trigger('error', that, err, options);
          }
        };
        this.findExisting(this.documentKey, currValue, checkOptions);

      // Otherwise just go ahead and save
      } else {
        XM.Model.prototype.save.call(this, key, value, options);
      }
    },

    statusDidChange: function () {
      var K = XM.Model,
        D = XM.Document;
      if (this.numberPolicy === D.AUTO_NUMBER &&
          this.getStatus() === K.READY_CLEAN) {
        this.setReadOnly(this.documentKey);
      }
    }

  });

  XM.Document = XM.Document.extend(XM.DocumentAssignmentsMixin);

  _.extend(XM.Document, /** @lends XM.Document# */{

    /**
      Numbers are manually generated.

      @static
      @constant
      @type String
      @default M
    */
    MANUAL_NUMBER: 'M',

    /**
      Numbers are automatically generated by the server.

      @static
      @constant
      @type String
      @default A
    */
    AUTO_NUMBER: 'A',

    /**
      Numbers are automatically generated, but can be over-ridden by the user.

      @static
      @constant
      @type Number
      @default O
    */
    AUTO_OVERRIDE_NUMBER: 'O'

  }
     );

}());
