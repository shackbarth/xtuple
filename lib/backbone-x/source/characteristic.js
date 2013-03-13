/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
	@name XM.Characteristic
    @extends XM.Document
  */
  XM.Characteristic = XM.Document.extend(/** @lends XM.Characteristic# */{

    recordType: 'XM.Characteristic',

    documentKey: 'name',

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

    contextAttributes: [
      "isAddresses",
      "isContacts",
      "isAccounts",
      "isItems",
      "isIncidents",
      "isOpportunities"
    ],

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
        K = XM.Model;

      if (status !== K.READY_NEW) {
        this.setReadOnly('characteristicType', true);
      }
      XM.Document.prototype.statusDidChange.apply(this, arguments);
    },

    validateSave: function () {
      var models = this.get('options').models,
        values = [],
        i;

      var contextError = false;
      for (i = 0; i < this.contextAttributes.length; i++) {
        var attr = this.contextAttributes[i];
        if (this.get(attr)) {
          contextError = true;
          break;
        }
      }
      if (!contextError) {
        return XT.Error.clone('xt2002');
      }

      // Validate options for duplicates
      for (i = 0; i < models.length; i += 1) {
        values.push(models[i].get('value'));
      }
      if (!_.isEqual(values, _.unique(values))) {
        return XT.Error.clone('xt2003');
      }
    }

  });

  _.extend(XM.Characteristic, /** @lends XM.Characteristic# */{

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
    @name XM.CharacteristicOption
    @extends XM.Model
  */
  XM.CharacteristicOption = XM.Model.extend(/** @lends XM.CharacteristicOption# */{

    recordType: 'XM.CharacteristicOption',

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "order"
    ]

  });

  /**
    @class Base class for use on characteristic assignment classes.
    @name XM.CharacteristicAssignment
    @extends XM.Model
  */
  XM.CharacteristicAssignment = XM.Model.extend(/** @lends XM.CharacteristicAssignment# */{

    requiredAttributes: [
      "characteristic"
    ],

    //..................................................
    // METHODS
    //

    initialize: function () {
      XM.Model.prototype.initialize.apply(this, arguments);
      this.on('change:characteristic', this.characteristicDidChange);
    },

    characteristicDidChange: function (model, value, options) {
      if (this.isNotReady()) { return; }
      this.set('value', '');
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class
    @name XM.CharacteristicCollection
    @extends XM.Collection
  */
  XM.CharacteristicCollection = XM.Collection.extend(/** @lends XM.CharacteristicCollection# */{

    model: XM.Characteristic

  });

}());
