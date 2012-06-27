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
  
    @extends XM.Document
  */
  XM.Address = XM.Document.extend({
    /** @scope XM.Address.prototype */

    recordType: 'XM.Address',

    numberPolicy: XM.Document.AUTO_NUMBER,

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
    }],

    // ..........................................................
    // METHODS
    //

    /**
      Success response returns an integer from the server indicating how many times the address
      is used by other records.

      @param {Object} Options
      @returns Receiver
    */
    useCount: function (options) {
      console.log("XM.Address.useCount for: " + this.id);
      XT.dataSource.dispatch('XM.Address', 'useCount', this.id, options);
      return this;
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Address, {

    /**
      Success response returns an address id for an address with the same fields
      as those passed.

      @param {String} Line1
      @param {String} Line2
      @param {String} Line3
      @param {String} City
      @param {String} State
      @param {String} Postal Code
      @param {String} Country
      @param {Object} Options
      @returns Receiver
    */
    findExisting: function (line1, line2, line3, city, state, postalcode, country, options) {
      var params = {
          type: 'Address',
          line1: line1,
          line2: line2,
          line3: line3,
          city: city,
          state: state,
          postalcode: postalcode,
          country: country
        };
      XT.dataSource.dispatch('XM.Address', 'findExisting', params, options);
      console.log("XM.Address.findExisting");
      return this;
    }

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
    
    readOnly: true,

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
