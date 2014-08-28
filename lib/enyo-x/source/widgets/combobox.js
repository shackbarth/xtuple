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
    kind: "XV.InputWidget",
    published: {
      attr: null,
      collection: "",
      filter: null,
      disabled: false,
      keyAttribute: "name",
      tabStop: true
    },
    classes: "xv-combobox xv-input",
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {controlClasses: 'enyo-inline', name: "container", components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", tag: "div", classes: "xv-icon-decorator", components: [
          {name: "input", kind: "onyx.Input", onkeyup: "keyUp", onkeydown: "keyDown",
            onblur: "receiveBlur", onchange: "inputChanged"},
          {kind: "onyx.IconButton", name: "iconButton", ontap: "toggleCompleter",
            classes: "icon-sort"}
        ]},
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
      this.tabStopChanged();
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

      if (_.isObject(this.collection)) {
        this._collection = this.collection;
      } else {
        this._collection = XT.getObjectByName(this.collection);
        // If we don't have data yet, try again after start up tasks complete
        if (!this._collection) {
          callback = function () {
            that.collectionChanged();
          };
          XT.getStartupManager().registerCallback(callback);
          return;
        }
      }
      this.buildList();
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
    },
    /**
    @todo Document the keyDown method.
    */
    keyDown: function (inSender, inEvent) {
      this.inherited(arguments);

      // If tabbed out...
      if (inEvent.keyCode === XV.KEY_TAB) {
        this.$.completer.hide();
        this.autocomplete();
      }
    },
    /**
    @todo Document the keyUp method.
    */
    keyUp: function (inSender, inEvent) {
      if (inEvent.keyCode === XV.KEY_TAB) { return; }
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
    @todo Document the receiveBlur method.
    */
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    tabStopChanged: function () {
      this.$.input.setAttribute("tabIndex", this.getTabStop() ? null: -1);
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
