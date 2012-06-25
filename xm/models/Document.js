/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
    
    Includes functionality common to xTuple documents uniquely identified by
    a user accessible `documentKey'.
  */
  XM.Document = XT.Model.extend({
    /** @scope XM.Document */
    
    /**
      The unique property for the document, typically a number, code or name.
      This property will be checked when a user edits it to ensure it has not already
      been used by another record of the same type.

      @default number
      @type {String}
    */
    documentKey: 'number',
    
    /**
      If set, the number Policy property will be set based on the number
      generation policy on this setting.
      
      @seealso `getNumberPolicy`
      @type {String}
    */
    numberPolicySetting: null,

    // ..........................................................
    // METHODS
    //
    
    destroy: function () {
      var K = XT.Model,
        status = this.getStatus();

      /* release the number if applicable */
      if (status === K.READY_NEW && this._number) {
        this.releaseNumber();
      }
      XT.Model.prototype.destroy.apply(this, arguments);
    },
    
    documentKeyDidChange: function () {
      var K = XT.Model,
        D = XM.Document,
        that = this,
        status = this.getStatus(),
        value = this.get(this.documentKey),
        upper = value ? value.toUpperCase() : undefined,
        options = {};
        
      // Handle uppercase
      if (value !== upper) {
        this.set(this.documentKey, upper);
        return;  // Will check again on next pass
      }
      
      // Release the fetched number if applicable
      if (status === K.READY_NEW && this._number && this._number !== value) {
        this.releaseNumber();
      }
      
      // Check for conflicts
      if (value && this.isDirty() && !this._number) {
        options.success = function (resp) {
          var err = "_documentKeyExists".loc().replace("{value}", value);
          if (resp) {
            that.trigger('error', that, err, options);
          }
        };
        this.findExisting(this.documentKey, value, options);
      }
    },
    
    initialize: function (attributes, options) {
      XT.Model.prototype.initialize.apply(this, arguments);
      var K = XM.Document;
      attributes = attributes || {};
      if (options && options.isNew &&
         (this.getNumberPolicy() === K.AUTO_NUMBER ||
          this.getNumberPolicy() === K.AUTO_OVERRIDE_NUMBER)) {
        this.fetchNumber();
      }
      this.requiredAttributes.push(this.documentKey);
      this.on('change:' + this.documentKey, this.documentKeyDidChange);
      this.on('statusChange', this.statusDidChange);
    },
    
    /**
      Number generation method for the document key that can be one of three constants:
        XM.Document.MANUAL_NUMBER
        XM.Document.AUTO_NUMBER
        XT.Document.AUTO_OVERRIDE_NUMBER

      Can be inferred from the setting that controls this for a given record type
      if it is set.

      @seealso `numberPolicySetting`
      @seealso `setNumberPolicy`
      @default XT.MANUAL_NUMBER
    */
    getNumberPolicy: function () {
      var setting,
        K = XM.Document;
      if (!this._numberPolicy) {
        setting =  this.get('numberPolicySetting');
        this._numberPolicy = setting ? XT.session.getSettings.get(setting) : K.MANUAL_NUMBER;
      }
      return this._numberPolicy;
    },
    
    /**
      A utility function to sets the next sequential number on a record.

      The function will send the class name property of itself to the server
      which will cross reference the ORM 'orderSequnce' property for the class
      to determine which sequence to use.

      @returns {Object} Receiever
    */
    fetchNumber: function () {
      var that = this,
        options = {};
      options.success = function (resp) {
        that._number = resp;
        that.set(that.documentKey, resp, {force: true});
      };
      XT.dataSource.dispatch('XT.Model', 'fetchNumber',
                             this.recordType, options);
      console.log("XT.Model.fetchNumber for: " + this.recordType);
      return this;
    },

    /**
      Releases a number back into the number pool for the record type. Usually
      would happen when user cancels without saving a new record.

      The function will send the class name property of itself to the server
      which will cross reference the ORM 'orderSequnce' property for the class
      to determine which sequence to use.

      @returns {Object} Receiever
    */
    releaseNumber: function () {
      XT.dataSource.dispatch('XT.Model', 'releaseNumber',
                             [this.recordType, this._number]);
      this._number = null;
      console.log("XT.Model.releaseNumber for: " + this.recordType);
      return this;
    },
    
    /**
      This version of `save` first checks to see if the document key already
      exists before committing.
    */
    save: function (key, value, options) {
      var model = this,
        K = XT.Model,
        currValue = this.get(this.documentKey),
        origValue = this.original(this.documentKey),
        status = this.getStatus(),
        checkOptions = {};
        
      // Check for number conflicts if we should
      if ((status === K.READY_NEW && currValue && !this._number) ||
          (status === K.READY_DIRTY && currValue !== origValue)) {
        checkOptions.success = function (resp) {
          var err = 'Save failed. Document with key of "' +
                    currValue + '" already exists.';
          if (resp === 0) {
            XT.Model.prototype.save.call(model, key, value, options);
          } else {
            model.trigger('error', model, err, options);
          }
        };
        checkOptions.error = Backbone.wrapError(null, model, options);
        this.findExisting(this.documentKey, currValue, checkOptions);
        
      // Otherwise just go ahead and save
      } else {
        XT.Model.prototype.save.call(model, key, value, options);
      }
    },
    
    /**
      @param {Number} Number Policy
      @returns Receiver
    */
    setNumberPolicy: function (value) {
      this._numberPolicy = value;
      return this;
    },
    
    statusDidChange: function () {
      var K = XT.Model,
        D = XM.Document;
      if (this.getNumberPolicy() === D.AUTO_NUMBER &&
          this.getStatus() === K.READY_CLEAN) {
        this.setReadOnly(this.documentKey);
      }
    }
    
  });
  
  _.extend(XM.Document, {
      /** @scope XM.Document */

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