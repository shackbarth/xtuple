/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.Country = XM.Model.extend({
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
      var params = {};

      if (attributes.abbreviation &&
          attributes.abbreviation.length !== 2) {
        params.attr = "_abbreviation".loc();
        params.length = "2";
        return XT.Error.clone('xt1006', { params: params });
      }

      if (attributes.currencyAbbreviation &&
          attributes.currencyAbbreviation.length !== 3) {
        params.attr = "_currencyAbbreviation".loc();
        params.length = "3";
        return XT.Error.clone('xt1006', { params: params });
      }
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.State = XM.Model.extend({
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
    ]

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

    // ..........................................................
    // METHODS
    //

    /**
      Formats the multiple lines of an address into a
      text block separating the elements of the address by line breaks.

      @params {Boolean} Is HTML
      @return {String}
    */
    format: function (isHtml) {
      return XM.Address.format(this, isHtml);
    },

    /**
      A formatted address that includes city, state and country.

      @return {String}
    */
    formatShort: function () {
      return XM.Address.formatShort(this);
    },

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
    },

    /**
      This function formats the multiple lines of an address into a
      text block separating the elements of the address by line breaks.

      Address format accepts multiple argument formats:
        XM.Address.format(address);
        XM.Address.format(address, isHtml);
        XM.Address.format(name, line1, line2, line3, city, state, postalcode, country);
        XM.Address.format(name, line1, line2, line3, city, state, postalcode, country, isHtml);

      Where address is an XM.Address and isHtml determines whether to
      use HTML line breaks instead of ASCII new line characters. The
      default for isHtml is false. The longer signatures accept string
      components of an address.

      @return {String}
    */
    format: function () {
      var fmtlines   = [],
        name, line1, line2, line3,
        city, state, postalcode, country,
        breaks, result = '', csz;

      if (typeof arguments[0] === 'object') {
        name = '';
        line1 = arguments[0].get('line1');
        line2 = arguments[0].get('line2');
        line3 = arguments[0].get('line3');
        city = arguments[0].get('city');
        state = arguments[0].get('state');
        postalcode = arguments[0].get('postalcode');
        country = arguments[0].get('country');
        breaks = (arguments[1] === undefined ? false : arguments[1]) ? '<br />' : '\n';
      } else if (typeof arguments[0] === 'string')  {
        name = arguments[0];
        line1 = arguments[1];
        line2 = arguments[2];
        line3 = arguments[3];
        city = arguments[4];
        state = arguments[5];
        postalcode = arguments[6];
        country = arguments[7];
        breaks = (arguments[8] === undefined ? false : arguments[8]) ? '<br />' : '\n';
      } else { return false; }

      if (name) { fmtlines.push(name); }
      if (line1) { fmtlines.push(line1); }
      if (line2) { fmtlines.push(line2); }
      if (line3) { fmtlines.push(line3); }
      if (city || state || postalcode) {
        csz = (city || '') +
              (city && (state || postalcode) ? ', '  : '') +
              (state || '') +
              (state && postalcode ? ' '  : '') +
              (postalcode || '');
        fmtlines.push(csz);
      }
      if (country) { fmtlines.push(country); }

      if (fmtlines.length) { result = fmtlines.join(breaks); }

      return result;
    },

    /**
      A formatted address that includes city, state and country.

      @return {String}
    */
    formatShort: function (address) {
      var ret,
        city = address.get('city') || '',
        state = address.get('state') || '',
        country = address.get('country') || '';
      ret = city + (city && state ? ', ' : '') + state;
      ret += (ret ? ' ' : '') + country;
      return ret;
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AddressComment = XM.Model.extend({
    /** @scope XM.AddressComment.prototype */

    recordType: 'XM.AddressComment'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AddressCharacteristic = XM.Model.extend({
    /** @scope XM.AddressCharacteristic.prototype */

    recordType: 'XM.AddressCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AddressInfo = XM.Model.extend({
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
    },

    // ..........................................................
    // METHODS
    //

    /**
      Formats the multiple lines of an address into a
      text block separating the elements of the address by line breaks.

      @params {Boolean} Is HTML
      @return {String}
    */
    format: function (isHtml) {
      return XM.Address.format(this, isHtml);
    },

    /**
      A formatted address that includes city, state and country.

      @return {String}
    */
    formatShort: function () {
      return XM.Address.formatShort(this);
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.AddressInfoCollection = XM.Collection.extend({
    /** @scope XM.AddressInfoCollection.prototype */

    model: XM.AddressInfo

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.CountryCollection = XM.Collection.extend({
    /** @scope XM.CountryCollection.prototype */

    model: XM.Country

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.StateCollection = XM.Collection.extend({
    /** @scope XM.StateCollection.prototype */

    model: XM.State

  });

}());
