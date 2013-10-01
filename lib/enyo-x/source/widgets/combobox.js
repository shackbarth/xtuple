/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, browser:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  /**
    @name XV.ComboboxWidget
    @class An input control consisting of fittable columns:
      label, decorator, and combobox.<br />
    Used to implement a styled combobox
    @extends XV.Input
   */
  enyo.kind(
    /** @lends XV.CheckboxWidget# */{
    name: "XV.ComboboxWidget",
    kind: "XV.Input",
    published: {
      collection: "",
      filter: null,
      disabled: false,
      keyAttribute: "name",
      label: "",
      showLabel: true
    },
    classes: "xv-combobox",
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "FittableColumns", name: "fittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label", fit: true},
        {name: "input", kind: "onyx.Input", classes: "xv-combobox-input",
          onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
          onchange: "inputChanged" },
        {kind: "onyx.IconButton", name: "iconButton", src: "/assets/combobox-icon.png",
          ontap: "toggleCompleter", classes: "xv-combobox-icon"},
        {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
      ]}
    ],
    /**
    @todo Document the create method.
    */
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.filterChanged();
      this.labelChanged();
      this.showLabelChanged();
    },
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
    @todo Document the clear method.
    */
    clear: function (options) {
      this.setValue(false, options);
    },
    /**
      The value sent to setCollection() can be an object or a string.
      If it's a string, resolve it via the cache.
      The actual collection will be this._collection
    */
    collectionChanged: function () {
      var that = this,
        callback;

      if (typeof this.collection === 'object') {
        this._collection = this.collection;
        return;
      }

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
    controlValueChanged: function (inSender, inEvent) {
      if (inEvent.originator !== this) {
        this.setValue(inEvent.value);
        return true;
      }
    },
    setDisabled: function (isDisabled) {
      this.inherited(arguments);
      this.$.iconButton.setDisabled(isDisabled);
      this.$.label.addRemoveClass("disabled", isDisabled);
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
    @todo Document the labelChanged method.
    */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc()) + ":";
      this.$.label.setContent(label);
    },
    /**
    @todo Document the receiveBlur method.
    */
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    showLabelChanged: function () {
      this.$.label.setShowing(this.getShowLabel());
      this.$.input.addRemoveClass("xv-combobox-input-with-label", this.getShowLabel());
      if (this.getShowLabel()) {
        // fighting with FittableColumns here
        this.$.iconButton.applyStyle("margin-top", "5px !important;");
      }
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

}());
