/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @class
    @name XV.Combobox
    @extends XV.Input
    @see XV.StateCombobox
    @see XV.CountryCombobox
   */
  enyo.kind(/** @lends XV.Combobox# */{
    name: "XV.Combobox",
    kind: "XV.Input",
    classes: "xv-combobox",
    published: {
      keyAttribute: "name",
      collection: "",
      filter: null
    },
    components: [
      {name: "input", kind: "onyx.Input", classes: "xv-combobox-input",
        onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
        onchange: "inputChanged"},
      {kind: "onyx.IconButton", src: "lib/enyo-x/assets/combobox-icon.png",
        ontap: "toggleCompleter", classes: "xv-combobox-icon"},
      {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
    ],
    autocomplete: function () {
      var key = this.getKeyAttribute(),
        value = this.$.input.getValue(),
        models = this._collection ? this._collection.models : null,
        regexp = value ? new RegExp("^" + value, "i") : null,
        res;

      if (models && models.length && regexp) {
        res = _.find(models, function (model) {
          var value = model.get(key) || "";
          return value.match(regexp);
        });
      }
      if (res) { this.setValue(res.get(key)); }
    },
    buildList: function () {
      var key = this.getKeyAttribute(),
        value = this.$.input.getValue(),
        models = this.filteredList();
      this.$.completer.buildList(key, value, models);
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.filterChanged();
    },
    keyDown: function (inSender, inEvent) {
      // If tabbed out...
      if (inEvent.keyCode === 9) {
        this.$.completer.hide();
        this.autocomplete();
      }
    },
    keyUp: function (inSender, inEvent) {
      if (inEvent.keyCode === 9) { return; }
      inEvent.activator = this;
      if (this.$.completer.controls.length) {
        this.$.completer.waterfall("onRequestHideMenu", inEvent);
      }
      this.buildList();
      if (this.$.completer.controls.length) {
        this.$.completer.waterfall("onRequestShowMenu", inEvent);
      }
    },
    collectionChanged: function () {
      var that = this,
        callback;
      this._collection = XT.getObjectByName(this.collection);
      // If we don't have data yet, try again after start up tasks complete
      if (!this._collection) {
        callback = function () {
          that.collectionChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }
    },
    itemSelected: function (inSender, inEvent) {
      this.setValue(inEvent.originator.content);
      this.$.completer.hide();
      return true;
    },
    filterChanged: function () {
      this.buildList();
    },
    filteredList: function (inSender, inEvent) {
      var models = this._collection ? this._collection.models : null,
        filter = this.getFilter();
      if (filter) {
        models = filter(models);
      }
      return models;
    },
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    toggleCompleter: function (inSender, inEvent) {
      inEvent.activator = this;
      var completer = this.$.completer;
      if (completer.showing) {
        completer.waterfall("onRequestHideMenu", inEvent);
      } else {
        completer.waterfall("onRequestShowMenu", inEvent);
      }
    }
  });


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
