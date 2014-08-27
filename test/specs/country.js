/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  /**
    @class
    @alias Country
    @property {String} abbreviation
    @property {String} name
    @property {String} CurrencyName
    @property {String} CurrencySymbol
    @property {String} CurrencyAbbreviation
    @property {Number} CurrencyNumber
  */
  var spec = {
    recordType: "XM.Country",
    collectionType: "XM.CountryCollection",
    /**
      @member -
      @memberof Country.prototype
      @description The country collection is cached.
    */
    cacheName: "XM.countries",
    listKind: "XV.CountryList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Country.prototype
      @description Countries are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Country.prototype
      @description The ID attribute is "abbreviation", which will be automatically uppercased.
    */
    idAttribute: "abbreviation",
    enforceUpperKey: true,
    attributes: ["id", "abbreviation", "name", "currencyName", "currencySymbol", "currencyAbbreviation", "currencyNumber"],
    requiredAttributes: ["abbreviation", "name", "currencyAbbreviation"],
    /**
      @member -
      @memberof Country.prototype
      @description Used in the crm and project modules
    */
    extensions: ["crm", "project"], //add purchasing
    /**
      @member -
      @memberof Country.prototype
      @description Countries can be read by anyone but can only be created, updated,
        or deleted by users with the "MaintainCountries" privilege.
    */
    privileges: {
      createUpdateDelete: "MaintainCountries",
      read: true
    },
    createHash: {
      name: "DQ Islands" + Math.random(),
      abbreviation: "X" + Math.random().toString(36).slice(3, 4),
      currencyName: "US Dollar",
      currencySymbol: "$",
      currencyAbbreviation: "USD",
      currencyNumber: "999"
    },
    updatableField: "name"
  };
  var additionalTests = function () {
    describe("Incident status behavior", function () {
      var countryModel;

      beforeEach(function () {
        countryModel = new XM.Country();
        countryModel.initialize(null, {isNew: true});
      });
      /**
        @member -
        @memberof Country.prototype
        @description Length of Abbreviation field should not exceed 2, Currency Abbreviation
        and Currency Number should not exceed 3 and Currency Number value should be an integer
      */
      it.skip("Abbreviation length should not exceed 2", function () {
        countryModel.set("abbreviation", "22");
        assert.isUndefined(countryModel.validate(countryModel.attributes));
        countryModel.set("abbreviation", "333");
        assert.isObject(countryModel.validate(countryModel.attributes));
      });
      it.skip("Length of Currency Abbreviation should not exceed 3", function () {
        countryModel.set("abbreviation", "333");
        assert.isUndefined(countryModel.validate(countryModel.attributes));
        countryModel.set("abbreviation", "4444");
        assert.isObject(countryModel.validate(countryModel.attributes));
      });
      it.skip("Currency Number length should not exceed 3 ", function () {
        countryModel.set("abbreviation", "333");
        assert.isUndefined(countryModel.validate(countryModel.attributes));
        countryModel.set("abbreviation", "4444");
        assert.isObject(countryModel.validate(countryModel.attributes));
      });
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
