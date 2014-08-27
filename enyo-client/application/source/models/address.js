/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  // ..........................................................
  // MIXINS
  //

  /**
    Shared address functionality.
  */
  XM.AddressMixin = {
    numberPolicy: XM.Document.AUTO_NUMBER,

    // ..........................................................
    // METHODS
    //
    /**
      Set default country if applicable.
    */
    initialize: function (attributes, options) {
      XM.Document.prototype.initialize.apply(this, arguments);
      if (options && options.isNew && !this.get('country')) {
        var settings = XT.session ? XT.session.getSettings() : null,
          country = settings ? settings.get('DefaultAddressCountry') : null;
        if (country) { this.set('country', country); }
      }
    },

    /**
      Formats the multiple lines of an address into a
      text block separating the elements of the address by line breaks.

      @params {Boolean} Is HTML - default true
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

    isAllEmpty: function () {
      return !this.get("line1") &&
        !this.get("line2") &&
        !this.get("line3") &&
        !this.get("city") &&
        !this.get("state") &&
        !this.get("postalCode") &&
        !this.get("country");
    },

    /**
      Success response returns an integer from the server indicating how many times the address
      is used by other records.

      @param {Object} Options
      @returns Receiver
    */
    useCount: function (options) {
      this.dispatch('XM.Address', 'useCount', this.id, options);
      return this;
    },

    validate: function (attributes, options) {
      var settings = XT.session.getSettings(),
        strict = settings.get('StrictAddressCountry'),
        country = attributes.country,
        found;

      // Validate country if setting says to do so
      if (country && strict) {
        found = _.find(XM.countries.models, function (c) {
          return c.get('name') === country;
        });
        if (!found) {
          return XT.Error.clone('xt2008');
        }
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    }

  };

  /**
    @class

    @extends XM.Document
  */
  XM.Country = XM.Document.extend({
    /** @scope XM.Country.prototype */

    recordType: 'XM.Country',

    documentKey: "abbreviation",

    // ..........................................................
    // METHODS
    //

    validate: function (attributes) {
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

      if (attributes.currencyNumber &&
          attributes.currencyNumber.length !== 3) {
        params.attr = "_currencyNumber".loc();
        params.length = "3";
        return XT.Error.clone('xt1006', { params: params });
      }

      return XM.Document.prototype.validate.apply(this, arguments);
    }

  });

  /**
    @class

    @extends XM.Document
  */
  XM.State = XM.Document.extend({
    /** @scope XM.State.prototype */

    recordType: 'XM.State',

    documentKey: "abbreviation",

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Document
    @extends XM.AddressMixin
  */
  XM.Address = XM.Document.extend({
    /** @scope XM.Address.prototype */

    recordType: 'XM.Address'

  });

  XM.Address = XM.Address.extend(XM.AddressMixin);

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
      XM.ModelMixin.dispatch('XM.Address', 'findExisting', params, options);
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
      default for isHtml is true. The longer signatures accept string
      components of an address.

      @return {String}
    */
    format: function () {
      if (!arguments[0]) { return; }
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
        postalcode = arguments[0].get('postalCode');
        country = arguments[0].get('country');
        breaks = (arguments[1] === undefined ? true : arguments[1]) ? '<br />' : '\n';
      } else if (typeof arguments[0] === 'string')  {
        name = arguments[0];
        line1 = arguments[1];
        line2 = arguments[2];
        line3 = arguments[3];
        city = arguments[4];
        state = arguments[5];
        postalcode = arguments[6];
        country = arguments[7];
        breaks = (arguments[8] === undefined ? true : arguments[8]) ? '<br />' : '\n';
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

      short format accepts multiple argument formats:
        XM.Address.format(address);
        XM.Address.format(city, state, country);

      @return {String}
    */
    formatShort: function (address) {
      var ret,
        city,
        state,
        country;

      if (address && typeof address === 'object') {
        city = address.get('city') || '';
        state = address.get('state') || '';
        country = address.get('country') || '';
      } else {
        city = arguments[0] || '';
        state = arguments[1] || '';
        country = arguments[2] || '';
      }
      ret = city + (city && state ? ', ' : '') + state;
      ret += (ret ? ' ' : '') + country;
      return ret;
    },

    // ..........................................................
    // CONSTANTS
    //

    /**
      Option to convert the existing address into a new one.

      @static
      @constant
      @type Number
      @default 0
    */
    CHANGE_ONE: 0,

    /**
      Option to change the existing address so all users of the
      address are affected.

      @static
      @constant
      @type Number
      @default 1
    */
    CHANGE_ALL: 1

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
    @extends XM.AddressMixin
  */
  XM.AddressInfo = XM.Document.extend({
    /** @scope XM.AddressInfo.prototype */

    recordType: 'XM.AddressInfo',

    // ..........................................................
    // METHODS
    //

    /**
     Return a copy of this address.

     @return {XM.Address} copy of the address
    */
    copy: function () {
      var attrs = _.clone(this.attributes);
      delete attrs.id;
      delete attrs.dataState;
      delete attrs.number;
      delete attrs.type;
      delete attrs.isActive;
      return new XM.AddressInfo(attrs, {isNew: true});
    },

    isEmpty: function () {
      return (_.isEmpty(this.get('line1')) &&
              _.isEmpty(this.get('line2')) &&
              _.isEmpty(this.get('line3')) &&
              _.isEmpty(this.get('city')) &&
              _.isEmpty(this.get('state')) &&
              _.isEmpty(this.get('postalCode')) &&
              _.isEmpty(this.get('country')));
    }

  });

  XM.AddressInfo = XM.AddressInfo.extend(XM.AddressMixin);

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
