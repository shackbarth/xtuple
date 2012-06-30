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
  XM.Characteristic = XM.Document.extend({
    /** @scope XM.Characteristic.prototype */

    recordType: 'XM.Characteristic',

    documentKey: 'name',

    privileges: {
      "all": {
        "create": "MaintainCharacteristics",
        "read": true,
        "update": "MaintainCharacteristics",
        "delete": "MaintainCharacteristics"
      }
    },

    defaults: {
      characteristicType: 0,
      isAddresses: false,
      isContacts: false,
      isItems: false,
      order: 0
    },

    requiredAttributes: [
      "name",
      "characteristicType",
      "isAddresses",
      "isContacts",
      "isItems",
      "order"
    ],
    
    relations: [{
      type: Backbone.HasMany,
      key: 'options',
      relatedModel: 'XM.CharacteristicOption',
      reverseRelation: {
        key: 'characteristic'
      }
    }],
    
    //..................................................
    // METHODS
    //

    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:characteristicType', this.characteristicTypeDidChange);
      this.characteristicTypeDidChange();
    },

    /**
      Check characteristicType to disable unassociated properties.
    */
    characteristicTypeDidChange: function () {
      var type = this.get('characteristicType');
      switch (type) {
      case XM.Characteristic.TEXT:
        this.setReadOnly('options', true);
        this.setReadOnly('mask', false);
        this.setReadOnly('validator', false);
        break;
      case XM.Characteristic.LIST:
        this.setReadOnly('options', false);
        this.setReadOnly('mask', true);
        this.setReadOnly('validator', true);
        break;
      default:
        this.setReadOnly('options', true);
        this.setReadOnly('mask', true);
        this.setReadOnly('validator', true);
      }
    },
    
    statusDidChange: function () {
      var status = this.getStatus(),
        K = XT.Model;

      if (status !== K.READY_NEW) {
        this.setReadOnly('characteristicType', true);
      }
      XM.Document.prototype.statusDidChange.apply(this, arguments);
    },
    
    validateSave: function () {
      var models = this.get('options').models,
        values = [], i, j;

      // Validate at least one context selected
      if (!(this.get('isItems') || this.get('isContacts') ||
            this.get('isAddresses') || this.get('isAccounts'))) {
        return "_characteristicContextRequired".loc();
      }

      // Validate options for duplicates
      for (i = 0; i < models.length; i += 1) {
        values.push(models[i].get('value'));
      }
      if (!_.isEqual(values, _.unique(values))) {
        return "_duplicateValues".loc();
      }
    }

  });
  
  _.extend(XM.Characteristic, {
    /** @scope XM.Characteristic */

    /**
      @static
      @constant
      @type Number
      @default 0
    */
    TEXT: 0,

    /**
      @static
      @constant
      @type Number
      @default 1
    */
    LIST: 1,

    /**
      @static
      @constant
      @type Number
      @default 2
    */
    DATE: 2

  });
  
  /**
    @class

    @extends XT.Model
  */
  XM.CharacteristicOption = XT.Model.extend({
    /** @scope XM.CharacteristicOption.prototype */

    recordType: 'XM.CharacteristicOption',
    
    privileges: {
      "all": {
        "create": true,
        "read": true,
        "update": false,
        "delete": true
      }
    },

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ],

  });

  /**
    @class
    
    Base class for use on characteristic assignment classes.
  
    @extends XT.Model
  */
  XM.CharacteristicAssignment = XT.Model.extend({
    /** @scope XM.CharacteristicAssignment.prototype */

    relations: [{
      type: Backbone.HasOne,
      key: 'characteristic',
      relatedModel: 'XM.Characteristic',
      includeInJSON: 'guid'
    }],

    //..................................................
    // METHODS
    //

    initialize: function () {
      XT.Model.prototype.initialize.apply(this, arguments);
      this.on('change:characteristic', this.characteristicDidChange);
    },
 
    characteristicDidChange: function (model, value, options) {
      var status = this.getStatus(),
        K = XT.Model;
      this.set('value', '');
    }

  });
  
  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
  
    @extends XT.Collection
  */
  XM.CharacteristicCollection = XT.Collection.extend({
    /** @scope XM.CharacteristicCollection.prototype */

    model: XM.Characteristic

  });

}());