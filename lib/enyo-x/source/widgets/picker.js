/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  /** @private */
  var _selectValue = function (widget, value) {
    var coll = widget._collection,
      key = widget.idAttribute || (coll && coll.model ? coll.model.prototype.idAttribute : false),
      components = widget.$.picker.getComponents(),
      component;
    value = value && key ? value.get(key) : value;
    component = _.find(components, function (c) {
      if (c.kind === "onyx.MenuItem") {
        return (c.value ? c.value.get(key) : null) === value;
      }
    });
    if (!component) { value = null; }
    widget.$.picker.setSelected(component);
    return value;
  };

  /**
    @name XV.Picker
    @class A picker control that implements a dropdown list of items which can be selected.<br />
    Unlike the {@link XV.RelationWidget}, the collection is stored local to the widget.<br />
    The superkind of {@link XV.CharacteristicPicker}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Control">enyo.Control</a>.
    @extends enyo.Control
   */
  enyo.kind(/** @lends XV.PickerWidget# */{
    name: "XV.Picker",
    kind: "enyo.Control",
    classes: "xv-pickerwidget",
    events: /** @lends XV.PickerWidget# */{
      /**
        @property {Object} inEvent The payload that's attached to bubbled-up events
        @property {XV.PickerWidget} inEvent.originator This
        @property inEvent.value The value passed up is the key of the object and not the object itself
       */
      onValueChange: ""
    },
    published: {
      attr: null,
      value: null,
      collection: null,
      disabled: false,
      nameAttribute: "name",
      orderBy: null,
      noneText: "_none".loc(),
      noneClasses: "",
      showNone: true
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "onyx.PickerDecorator",
        components: [
        {content: "_none".loc(), classes: "xv-picker"},
        {name: "picker", kind: "onyx.Picker"}
      ]}
    ],
    /**
     @todo Document the buildList method.
     */
    buildList: function (options) {
      var nameAttribute = this.getNameAttribute(),
        models = this.filteredList(options),
        none = this.getNoneText(),
        classes = this.getNoneClasses(),
        name,
        model,
        i;
      this.$.picker.destroyClientControls();
      if (this.showNone) {
        this.$.picker.createComponent({
          value: null,
          content: none,
          classes: classes
        });
      }
      for (i = 0; i < models.length; i++) {
        model = models[i];
        name = model.get(nameAttribute);
        this.$.picker.createComponent({ value: model, content: name });
      }
      this.$.picker.render();
    },
    /**
     @todo Document the clear method.
     */
    clear: function (options) {
      this.setValue(null, options);
    },
    /**
     Collection can either be a pointer to a real collection, or a string
     that will be resolved to a real collection.
     */
    collectionChanged: function () {
      var collection = _.isObject(this.collection) ? this.collection :
          XT.getObjectByName(this.collection);

      // Remove any old bindings
      if (this._collection) {
        this._collection.off("add remove", this.buildList, this);
      }

      this._collection = collection;
      this._collection.on("add remove", this.buildList, this);
      this.orderByChanged();
      if (this._collection.comparator) { this._collection.sort(); }
      this.buildList();
    },
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.noneTextChanged();
      if (this.getCollection()) { this.collectionChanged(); }
    },
    destroy: function () {
      if (this._collection && this._collection.off) {
        this._collection.off("add remove", this.buildList, this);
      }
      this.inherited(arguments);
    },
    /**
     @todo Document the disabledChanged method.
     */
    disabledChanged: function (inSender, inEvent) {
      this.$.pickerButton.setDisabled(this.getDisabled());
    },
    /**
     @todo Document the getValueToString method.
     */
    getValueToString: function () {
      return this.$.pickerButton.getContent();
    },
    /**
     @todo Document the itemSelected method.
     */
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().value;
      this.setValue(value);
      return true;
    },
    /**
      Implement your own filter function here. By default
      simply returns the array of models passed.

      @param {Array}
      @returns {Array}
    */
    filter: function (models, options) {
      return models || [];
    },
    /**
      Returns array of models for current collection instance with `filter`
      applied.
    */
    filteredList: function (options) {
      return this._collection ? this.filter(this._collection.models, options) : [];
    },
    /**
     @todo Document the noneTextChanged method.
     */
    noneTextChanged: function () {
      var noneText = this.getNoneText(),
        input = this.$.inputWrapper.children[0].children[0];
      if (!this.value) { input.setContent(noneText); }
      this.buildList();
    },
    /**
     @todo Document the noneClassesChanged method.
     */
    noneClassesChanged: function () {
      this.buildList();
    },
    /**
     @todo Document the orderByChanged method.
     */
    orderByChanged: function () {
      var orderBy = this.getOrderBy();
      if (this._collection && orderBy) {
        this._collection.comparator = function (a, b) {
          var aval,
            bval,
            attr,
            i;
          for (i = 0; i < orderBy.length; i++) {
            attr = orderBy[i].attribute;
            aval = orderBy[i].descending ? b.getValue(attr) : a.getValue(attr);
            bval = orderBy[i].descending ? a.getValue(attr) : b.getValue(attr);
            // Bad hack for null 'order' values
            if (attr === "order" && !_.isNumber(aval)) { aval = 9999; }
            if (attr === "order" && !_.isNumber(bval)) { bval = 9999; }
            aval = !isNaN(aval) ? aval - 0 : aval;
            bval = !isNaN(aval) ? bval - 0 : bval;
            if (aval !== bval) {
              return aval > bval ? 1 : -1;
            }
          }
          return 0;
        };
      }
    },
    /**
     @todo Document the select method.
     */
    select: function (index) {
      var i = 0,
        component = _.find(this.$.picker.getComponents(), function (c) {
          if (c.kind === "onyx.MenuItem") { i++; }
          return i > index;
        });
      if (component) {
        this.setValue(component.value);
      }
    },
    /**
      Programatically sets the value of this widget.

      @param value Can be a model or the id of a model (String or Number).
        If it is an ID, then the correct model will be fetched and this
        function will be called again recursively with the model.
      @param {Object} options
     */
    setValue: function (value, options) {
      options = options || {};
      var key = this.idAttribute || (this._collection && this._collection.model ?
        this._collection.model.prototype.idAttribute : false),
        oldValue = this.getValue(),
        actualMenuItem,
        actualModel,
        inEvent;
      
      // here is where we find the model and re-call this method if we're given
      // an id instead of a whole model.
      // note that we assume that all of the possible models are already
      // populated in the menu items of the picker
      // note: value may be a '0' value
      if (key && (value || value === 0) && typeof value !== 'object') {
        actualMenuItem = _.find(this.$.picker.controls, function (menuItem) {
          var ret = false;
          if (menuItem.value && menuItem.value.get) {
            ret = menuItem.value.get(key) === value;
          } else if (menuItem.value) {
            ret = menuItem.value[key] === value;
          }
          return ret;
        });
        if (actualMenuItem) {
          // a menu item matches the selection. Use the model back backs the menu item
          actualModel = actualMenuItem.value;
          this.setValue(actualModel, options);
        }
        // (else "none" is selected and there's no need to do anything)
        return;
      }

      if (value !== oldValue) {
        if (!_selectValue(this, value) && _selectValue(this, value) !== 0) { value = null; }
        if (value !== oldValue) {
          this.value = value;
          if (!options.silent) {
            inEvent = { originator: this, value: value && value.get ? value.get(key) : value };
            this.doValueChange(inEvent);
          }
        }
      }
    }
  });

  /**
    @name XV.PickerWidget
    @class A picker control that implements a dropdown list of items which can be selected.<br />
    Unlike the {@link XV.RelationWidget}, the collection is stored local to the widget.<br />
    The superkind of {@link XV.CharacteristicPicker}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Control">enyo.Control</a>.
    @extends enyo.Control
   */
  enyo.kind(/** @lends XV.PickerWidget# */{
    name: "XV.PickerWidget",
    kind: "XV.Picker",
    published: {
      label: "",
      showLabel: true
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-picker-label"},
        {kind: "onyx.InputDecorator", name: "inputWrapper", classes: "xv-input-decorator",
          components: [
          {kind: "onyx.PickerDecorator",
            components: [
            {content: "_none".loc(), classes: "xv-picker"},
            {name: "picker", kind: "onyx.Picker"}
          ]}
        ]}
      ]}
    ],
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.labelChanged();
      this.showLabelChanged();
    },
    /**
     @todo Document the labelChanged method.
     */
    labelChanged: function () {
      var label = this.getLabel() ||
        (this.attr ? ("_" + this.attr).loc() : "");
      this.$.label.setShowing(label);
      this.$.label.setContent(label + ":");
    },
    /**
     @todo Document the showLabelChanged method.
     */
    showLabelChanged: function () {
      if (this.getShowLabel()) {
        this.$.label.show();
      } else {
        this.$.label.hide();
      }
    }
  });

}());
