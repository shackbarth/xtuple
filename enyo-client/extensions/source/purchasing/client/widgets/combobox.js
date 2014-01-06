/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict: false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.purchasing.initCombobox = function () {

    // ..........................................................
    // MANUFACTURER
    //

    /**
      @class A combobox backed by the XM.countries collection.
      @name XV.ManufacturerCombobox
      @extends XV.Combobox
     */
    enyo.kind(
      /** @lends XV.CountryCombobox# */{
      name: "XV.ItemSourceManufacturerCombobox",
      kind: "XV.ComboboxWidget",
      collection: "XM.itemSourceManufacturers",
      keyAttribute: "manufacturerName",
      label: "_manufacturer".loc(),
    });

  };

}());
