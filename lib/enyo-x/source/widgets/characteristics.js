/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {

  var TEXT = 0;
  var LIST = 1;
  var DATE = 2;

  /**
    @name XV.CharacteristicPicker
    @class For the {@link XV.CharacteristicsWidget} displays the list of characteristics
    that the user can select from to classify a {@link XV.CharacteristicItem}.
    @extends XV.PickerWidget
   */
  enyo.kind(
    /** @lends XV.CharacteristicPicker# */{
    name: "XV.CharacteristicPicker",
    kind: "XV.PickerWidget",
    collection: "XM.characteristics",
    noneText: "_delete".loc(),
    noneClasses: "xv-negative",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  /**
    @name XV.OptionsPicker
    @class Displays a list of items that can be selected.
   */
  enyo.kind(/** @lends XV.OptionsPicker# */{
    name: "XV.OptionsPicker",
    published: {
      attr: null,
      collection: null,
      value: null,
      disabled: false
    },
    events: {
      onValueChange: ""
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
        components: [
        {kind: "onyx.PickerDecorator",
          components: [
          {classes: "xv-picker"},
          {name: "picker", kind: "onyx.Picker"}
        ]}
      ]}
    ],
    disabledChanged: function () {
      // XXX Implementation appears slightly crazy because I can't find a disable
      // setter for onyx.InputDecorator:
      // http://enyojs.com/api/#onyx.InputDecorator::disabledChange
      //
      this.$.inputDecorator.disabled = this.disabled;
      this.$.inputDecorator.bubble("onDisabledChange");
    },
    /**
     @todo Document the itemSelected method.
     */
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().content;
      this.setValue(value);
      return true;
    },
    /**
     @todo Document the setCollection method.
     */
    setCollection: function (collection) {
      var model,
        value,
        i,
        c;
      this.collection = collection;
      collection.comparator = this.sort;
      collection.sort();
      this.$.picker.destroyClientControls();
      for (i = 0; i < collection.length; i++) {
        model = collection.at(i);
        value = model.get('value');
        c = this.$.picker.createComponent({ content: value });
        // Autormatically select first
        if (i === 0) { this.$.picker.setSelected(c); }
      }
      this.render();
    },
    /**
     @todo Document the setValue method.
     */
    setValue: function (value, options) {
      options = options || {};
      var oldValue = this.getValue(),
        inEvent,
        components = this.$.picker.getComponents(),
        component = _.find(components, function (c) {
          if (c.kind === "onyx.MenuItem") {
            return c.content === value;
          }
        });
      if (!component) { value = null; }
      this.$.picker.setSelected(component);

      if (value !== oldValue) {
        this.value = value;
        if (!options.silent) {
          inEvent = { originator: this, value: value };
          this.doValueChange(inEvent);
        }
      }
      return value;
    },
    /**
     @todo Document the sort method.
     */
    sort: function (a, b) {
      var aord = a.get('order'),
        bord = b.get('order'),
        aname,
        bname;
      if (aord === bord) {
        aname = a.get('value');
        bname = b.get('value');
        return aname < bname ? -1 : 1;
      }
      return aord < bord ? -1 : 1;
    }
  });

  /**
    @name XV.CharacteristicItem
    @class Contains a set of fittable columns which make up a single row in a list of characteristics
      for the {@link XV.CharacteristicsWidget}.<br />
    Components: {@link XV.CharacteristicPicker}, {@link XV.InputWidget},
      {@link XV.DateWidget}, {@link XV.OptionsPicker}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableColumns">enyo.FittableColumns</a>.
    @extends enyo.FittableColumns
   */
  enyo.kind(/** @lends XV.CharacteristicItem# */{
    name: "XV.CharacteristicItem",
    kind: "enyo.Control",
    classes: "xv-characteristic-item",
    published: {
      value: null,
      disabled: false
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {kind: "XV.CharacteristicPicker", attr: "characteristic",
          showLabel: false},
        {kind: "XV.InputWidget", attr: "value", showLabel: false},
        {kind: "XV.DateWidget", attr: "value", showLabel: false,
          showing: false},
        {kind: "XV.OptionsPicker", attr: "value", showLabel: false,
          showing: false}
      ]}
    ],
    disabledChanged: function (oldValue) {
      this.$.characteristicPicker.setDisabled(this.disabled);
      this.$.inputWidget.setDisabled(this.disabled);
      this.$.dateWidget.setDisabled(this.disabled);
      this.$.optionsPicker.setDisabled(this.disabled);
    },
    /**
     @todo Document the controlValueChanged method.
     */
    controlValueChanged: function (inSender, inEvent) {
      var attr = inEvent.originator.getAttr(),
        value = inEvent.originator.getValue(),
        attributes = {},
        model = this.getValue(),
        characteristic,
        defaultVal;
      attributes[attr] = _.isDate(value) ? value.toJSON() : value;
      model.set(attributes);
      if (attr === 'characteristic') {
        if (value) {
          characteristic = model.get('characteristic');
          switch (characteristic.get('characteristicType'))
          {
          case DATE:
            defaultVal = null;
            break;
          case TEXT:
            defaultVal = "";
            break;
          case LIST:
            defaultVal = characteristic.get('options').models[0].get('value');
          }
          model.set('value', defaultVal);
          this.valueChanged();
        } else {
          model.destroy();
        }
      }
      return true;
    },
    /**
     @todo Document the getCharacteristicPicker method.
     */
    getCharacteristicPicker: function () {
      return this.$.characteristicPicker;
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function () {
      var model = this.getValue(),
        characteristic = model.get('characteristic'),
        type = characteristic ?
          characteristic.get('characteristicType') : TEXT,
        value = model.get('value'),
        valueWidget,
        options;
      switch (type)
      {
      case TEXT:
        this.$.dateWidget.hide();
        this.$.optionsPicker.hide();
        this.$.inputWidget.show();
        valueWidget = this.$.inputWidget;
        break;
      case DATE:
        this.$.optionsPicker.hide();
        this.$.inputWidget.hide();
        this.$.dateWidget.show();
        valueWidget = this.$.dateWidget;
        break;
      case LIST:
        this.$.dateWidget.hide();
        this.$.inputWidget.hide();
        this.$.optionsPicker.show();
        valueWidget = this.$.optionsPicker;
        options = characteristic.get('options');
        this.$.optionsPicker.setCollection(options);
      }
      this.$.characteristicPicker.setValue(characteristic, {silent: true});
      valueWidget.setValue(value, {silent: true});
    }
  });

  /**
    @name XV.CharacteristicsWidget
    @class Use to implement a box for entering and viewing characteristics.
    Made up of a header, a repeater (the control for making the list of characteristic items),
      and fittable columns for the navigation buttons.<br />
    Components: {@link XV.CharacteristicItem}.
   */
  enyo.kind(/** @lends XV.CharacteristicsWidget# */{
    name: "XV.CharacteristicsWidget",
    classes: "xv-characteristics-widget xv-input",
    published: {
      attr: null,
      model: null,
      value: null,
      // note: which is now being kept track of in the model, and maybe should
      // only be kept track of in the model.
      which: null,
      disabled: false,
      showLabel: false,
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_characteristics".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.CharacteristicItem"}
      ]},
      {controlClasses: 'enyo-inline', classes: "xv-buttons", components: [
        {kind: "onyx.Button", name: "newButton",
          classes: "icon-plus xv-characteristic-button", onclick: "newItem"}
      ]}
    ],
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.disabled);
    },
    /**
      Remove bindings
     */
    destroy: function () {
      if (this.value) {
        this.value.off('add', this.lengthChanged, this);
        this.value.off('statusChange', this.lengthChanged, this);
      }
      this.inherited(arguments);
    },
    /**
     Kick off the repeater.
     */
    lengthChanged: function () {
      this.$.repeater.setCount(this.readyModels().length);
    },
    /**
     Add a new model to the collection.
     */
    newItem: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        model = new Klass(null, { isNew: true });
      this.value.add(model);
    },
    /**
      Returns an array of models in the collection whose status is ready.

      @return {Array} models
     */
    readyModels: function () {
      return _.filter(this.value.models, function (model) {
        var status = model.getStatus(),
          K = XM.Model;
        // Avoiding bitwise because performance matters here
        return (status === K.READY_CLEAN ||
                status === K.READY_DIRTY ||
                status === K.READY_NEW);
      });
    },
    /**
      Render the repeaterlist.
     */
    setupItem: function (inSender, inEvent) {
      var item = inEvent.item.$.characteristicItem,
        model = this.readyModels()[inEvent.index],
        which = this.getWhich(),
        picker = item.getCharacteristicPicker(),
        filter = function (models) {
          return _.filter(models, function (m) {
            return m.get(which);
          });
        };
      item.setValue(model);
      item.setDisabled(this.disabled);
      if (picker) {
        // quote characteristics, notably, have no picker
        picker.filter = filter;
        picker.buildList();
        if (!model.get('characteristic')) {
          picker.select(1);
        }
      }
      return true;
    },
    /**
      Sort by status, then order, then name
     */
    sort: function (a, b) {
      var astatus = a.isNew(),
        bstatus = b.isNew(),
        achar = a.get('characteristic'),
        bchar = b.get('characteristic'),
        aord = achar ? achar.get('order') : null,
        bord = bchar ? bchar.get('order') : null,
        aname,
        bname;
      if (astatus === bstatus) {
        if (aord === bord) {
          aname = achar ? achar.get('name') : null;
          bname = bchar ? bchar.get('name') : null;
          return aname < bname ? -1 : 1;
        }
        return aord < bord ? -1 : 1;
      }
      return astatus < bstatus ? -1 : 1;
    },
    /**
      @param {XM.Collection} value
     */
    setValue: function (value) {
      if (this.value) {
        this.value.off('add', this.lengthChanged, this);
        this.value.off('statusChange', this.lengthChanged, this);
      }
      this.value = value;
      this.value.on('add', this.lengthChanged, this);
      this.value.on('statusChange', this.lengthChanged, this);
      this.value.comparator = this.sort;
      this.value.sort();
      this.lengthChanged();
    },
  });

}());
