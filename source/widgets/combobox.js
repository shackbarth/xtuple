/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Combobox
    @class Creates an HTML input element.<br />
    The superkind of {@link XV.StateCombobox} and {@link XV.CountryCombobox}.
    @extends XV.Input
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
    /**
    @todo Document the autocomplete method.
    */
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
    /**
    @todo Document the buildList method.
    */
    buildList: function () {
      var key = this.getKeyAttribute(),
        value = this.$.input.getValue(),
        models = this.filteredList();
      this.$.completer.buildList(key, value, models);
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.filterChanged();
    },
    /**
    @todo Document the keyDown method.
    */
    keyDown: function (inSender, inEvent) {
      // If tabbed out...
      if (inEvent.keyCode === 9) {
        this.$.completer.hide();
        this.autocomplete();
      }
    },
    /**
    @todo Document the keyUp method.
    */
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
    /**
    @todo Document the collectionChanged method.
    */
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
    /**
    @todo Document the itemSelected method.
    */
    itemSelected: function (inSender, inEvent) {
      this.setValue(inEvent.originator.content);
      this.$.completer.hide();
      return true;
    },
    /**
    @todo Document the filterChanged method.
    */
    filterChanged: function () {
      this.buildList();
    },
    /**
    @todo Document the filteredLists method.
    */
    filteredList: function (inSender, inEvent) {
      var models = this._collection ? this._collection.models : null,
        filter = this.getFilter();
      if (filter) {
        models = filter(models);
      }
      return models;
    },
    /**
    @todo Document the receiveBlur method.
    */
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    /**
    @todo Document the toggleCompleter method.
    */
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
  
  // ..........................................................
  // WIDGET
  //
  
  /**
    @name XV.ComboboxWidget
    @class An input control consisting of fittable columns:
      label, decorator, and combobox.<br />
    Used to implement a styled combobox
    @extends XV.Input
   */
  enyo.kind(/** @lends XV.CheckboxWidget# */{
    name: "XV.ComboboxWidget",
    kind: "XV.Input",
    published: {
      collection: "",
      filter: null,
      keyAttribute: "name",
      label: "",
      showLabel: true
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {name: "input", kind: "XV.Combobox",
          setValue: function (value) {
            // Input combobox is always silent in this context
            return XV.Combobox.prototype.setValue.call(this, value, {silent: true});
          }
        }
      ]}
    ],
    /**
    @todo Document the clear method.
    */
    clear: function (options) {
      this.setValue(false, options);
    },
    /**
    
    */
    collectionChanged: function () {
      this.$.input.setCollection(this.getCollection());
    },
    filterChanged: function () {
      this.$.input.setFilter(this.getFilter());
    },
    keyAttributeChanged: function () {
      this.$.input.setKeyAttribute(this.getKeyAttribute());
    },
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.filterChanged();
      this.keyAttributeChanged();
      this.labelChanged();
      this.$.input.buildList();
    },
    /**
    @todo Document the inputChanged method.
    */
    inputChanged: function (inSender, inEvent) {
      var input = this.$.input.getValue();
      this.setValue(input);
    },
    /**
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    }
  });

}());
