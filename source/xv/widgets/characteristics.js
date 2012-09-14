/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT TYPE
  //

  var TEXT = 0;
  var LIST = 1;
  var DATE = 2;

  enyo.kind({
    name: "XV.CharacteristicPicker",
    kind: "XV.PickerWidget",
    classes: "xv-characteristic-picker",
    collection: "XM.characteristics",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });

  enyo.kind({
    name: "XV.OptionsPicker",
    published: {
      attr: null,
      collection: null,
      value: null
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
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().content;
      this.setValue(value);
      return true;
    },
    setCollection: function (collection) {
      var model,
        value,
        i;
      this.collection = collection;
      collection.comparator = this.sort;
      collection.sort();
      this.$.picker.destroyClientControls();
      for (i = 0; i < collection.length; i++) {
        model = collection.at(i);
        value = model.get('value');
        this.$.picker.createComponent({ content: value });
      }
      this.render();
    },
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
    sort: function (a, b) {
      var aord = a.get('order'),
        bord = b.get('order'),
        aname,
        bname;
      if (aord === bord) {
        aname = a.get('value');
        bname = b.get('value');
        return aname < bname ? 1 : -1;
      }
      return aord < bord ? 1 : -1;
    }
  });

  enyo.kind({
    name: "XV.CharacteristicItem",
    kind: "FittableColumns",
    classes: "xv-characteristic-item",
    published: {
      value: null
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    events: {
      onItemDestroyed: ""
    },
    components: [
      {kind: "XV.CharacteristicPicker", attr: "characteristic",
        showLabel: false},
      {kind: "XV.InputWidget", attr: "value", showLabel: false},
      {kind: "XV.DateWidget", attr: "value", showLabel: false,
        showing: false},
      {kind: "XV.OptionsPicker", attr: "value", showLabel: false,
        showing: false}
    ],
    controlValueChanged: function (inSender, inEvent) {
      var attr = inSender.getAttr(),
        value = inSender.getValue(),
        attributes = {},
        model = this.getValue(),
        empty;
      attributes[attr] = _.isDate(value) ? value.toJSON() : value;
      model.set(attributes);
      if (attr === 'characteristic') {
        if (value) {
          empty = model.getValue('characteristic').get('characteristicType') === DATE ?
            null : "";
          model.set('value', empty);
          this.valueChanged();
        } else {
          model.destroy();
          this.doItemDestroyed();
        }
      }
      return true;
    },
    getCharacteristicPicker: function () {
      return this.$.characteristicPicker;
    },
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

  enyo.kind({
    name: "XV.CharacteristicsWidget",
    classes: "xv-characteristics-widget",
    published: {
      attr: null,
      model: null,
      value: null,
      which: null
    },
    handlers: {
      onItemDestroyed: "itemDestroyed"
    },
    components: [
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.CharacteristicItem"}
      ]},
      {kind: "FittableColumns", classes: "xv-characteristic-buttons",
        components: [
        {kind: "onyx.Button", name: "newButton",
          classes: "xv-characteristic-button", onclick: "newItem",
          content: "_new".loc()}
      ]}
    ],
/*
    deleteItem: function (inSender, inEvent) {
      //inEvent.originator.parent.getModel().destroy();
      //this.$.repeater.setCount(this._collection.length);
    },
*/
    itemDestroyed: function () {
      var len = this.readyModels().length;
      this.$.repeater.setCount(len);
    },
    newItem: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        model = new Klass(null, { isNew: true }),
        len = this.readyModels().length;
      this.value.add(model);
      this.$.repeater.setCount(len);
    },
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
      picker.filter = filter;
      picker.buildList();
      return true;
    },
    sort: function (a, b) {
      var aord = a.getValue('characeristic.order'),
        bord = b.getValue('characeristic.order'),
        aname,
        bname;
      if (aord === bord) {
        aname = a.getValue('characeristic.name');
        bname = b.getValue('characeristic.name');
        return aname < bname ? 1 : -1;
      }
      return aord < bord ? 1 : -1;
    },
    valueChanged: function () {
      // Set sort by order then name
      this.value.comparator = this.sort;
      this.value.sort();
      this.$.repeater.setCount(this.readyModels().length);
    }

  });

}());
