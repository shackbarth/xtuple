/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.Model
  */
  XM.Country = XT.Model.extend({
    /** @scope XM.Country.prototype */

    recordType: 'XM.Country',

    privileges: {
      "all": {
        "create": "MaintainCountries",
        "read": true,
        "update": "MaintainCountries",
        "delete": "MaintainCountries"
      }
    },

    requiredAttributes: [
      "abbreviation",
      "currencyAbbreviation",
      "name"
    ],

    // ..........................................................
    // METHODS
    //

    validateEdit: function (attributes) {
      if (attributes.abbreviation &&
          attributes.abbreviation.length !== 2) {
        return "_lengthInvalid".loc()
                               .replace("{attr}", "_abbreviation".loc())
                               .replace("{length}", "2");
      }

      if (attributes.currencyAbbreviation &&
          attributes.currencyAbbreviation.length !== 3) {
        return "_lengthInvalid".loc()
                               .replace("{attr}", "_currencyAbbreviation".loc())
                               .replace("{length}", "3");
      }
    }

  });

  /**
    @class

    @extends XT.Model
  */
  XM.State = XT.Model.extend({
    /** @scope XM.State.prototype */

    recordType: 'XM.State',

    privileges: {
      "all": {
        "create": "MaintainStates",
        "read": true,
        "update": "MaintainStates",
        "delete": "MaintainStates"
      }
    },

    requiredAttributes: [
      "abbreviation",
      "country",
      "name"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'country',
      relatedModel: 'XM.Country',
      includeInJSON: 'guid'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.Address = XT.Model.extend({
    /** @scope XM.Address.prototype */

    recordType: 'XM.Address',

    privileges: {
      "all": {
        "create": "MaintainAddresses",
        "read": "ViewAddresses",
        "update": "MaintainAddresses",
        "delete": "MaintainAddresses"
      }
    },

    relations: [{
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: 'XM.AddressComment',
      reverseRelation: {
        key: 'address'
      }
    }, {
      type: Backbone.HasMany,
      key: 'characteristics',
      relatedModel: 'XM.AddressCharacteristic',
      reverseRelation: {
        key: 'address'
      }
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.AddressComment = XT.Model.extend({
    /** @scope XM.AddressComment.prototype */

    recordType: 'XM.AddressComment'

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.AddressCharacteristic = XT.Model.extend({
    /** @scope XM.AddressCharacteristic.prototype */

    recordType: 'XM.AddressCharacteristic'

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.AddressInfo = XT.Model.extend({
    /** @scope XM.AddressInfo.prototype */

    recordType: 'XM.AddressInfo',

    privileges: {
      "all": {
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      }
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XT.Collection
  */
  XM.AddressInfoCollection = XT.Collection.extend({
    /** @scope XM.AddressInfoCollection.prototype */

    model: XM.AddressInfo

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.CountryCollection = XT.Collection.extend({
    /** @scope XM.CountryCollection.prototype */

    model: XM.Country

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.StateCollection = XT.Collection.extend({
    /** @scope XM.StateCollection.prototype */

    model: XM.State

  });

}());
