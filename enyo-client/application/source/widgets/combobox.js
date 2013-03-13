/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // COUNTRY
  //

  /**
    @class A combobox backed by the XM.countries collection.
    @name XV.CountryCombobox
    @extends XV.Combobox
   */
  enyo.kind(/** @lends XV.CountryCombobox# */{
    name: "XV.CountryCombobox",
    kind: "XV.Combobox",
    collection: "XM.countries"
  });

  // ..........................................................
  // HONORIFIC
  //

  /**
    @class A combobox backed by the XM.honorifics collection.
    @name XV.HonorificCombobox
    @extends XV.Combobox
   */
  enyo.kind(/** @lends XV.HonorificCombobox# */{
    name: "XV.HonorificCombobox",
    kind: "XV.ComboboxWidget",
    keyAttribute: "code",
    label: "_honorific".loc(),
    collection: "XM.honorifics"
  });

  // ..........................................................
  // QUOTE LINE CHARACTERISTIC
  //

  enyo.kind({
    name: "XV.QuoteLineCharacteristicCombobox",
    kind: "XV.ComboboxWidget",
    keyAttribute: "value",
    components: [
      {kind: "FittableColumns", name: "fittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label", style: "width: 100px;"},
        {name: "input", kind: "XV.Combobox", style: "width: 200px;"},
        {name: "comboboxNote", classes: "xv-combobox-note"}
      ]}
    ],
    /**
      Populate the note field

      @param {String} value
     */
    setNote: function (value) {
      this.$.comboboxNote.setContent(value);
    }
  });

  // ..........................................................
  // SHIP VIA
  //

  enyo.kind({
    name: "XV.ShipViaCombobox",
    kind: "XV.ComboboxWidget",
    collection: "XM.shipVias",
    label: "_shipVia".loc(),
    keyAttribute: "code"
  });

  // ..........................................................
  // STATE
  //

  /**
    @class A combobox backed by the XM.states collection.
    @name XV.StateCombobox
    @extends XV.Combobox
   */
  enyo.kind(/** @lends XV.StateCombobox# */{
    name: "XV.StateCombobox",
    kind: "XV.Combobox",
    collection: "XM.states",
    keyAttribute: "abbreviation",
    published: {
      country: null
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      var that = this,
        filter = function (models) {
          return _.filter(models, function (model) {
            var country = model.get('country') || {};
            return country.id === that._countryId;
          });
        };
      this.setFilter(filter);
    },
    /**
    @todo Document the countryChanged method.
    */
    countryChanged: function () {
      var country = this.getCountry();
      if (typeof country === 'string') {
        country = _.find(XM.countries.models, function (model) {
          return model.get('name') === country;
        });
        this._countryId = country ? country.id : undefined;
      } else if (typeof country === 'object') {
        this._countryId = country.id;
      } else if (typeof country === 'number') {
        this._countryId = country;
      } else {
        this._countryId = undefined;
      }
      this.buildList();
    }
  });
}());
