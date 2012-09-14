/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT TYPE
  //

  enyo.kind({
    name: "XV.CharacteristicPicker",
    kind: "XV.PickerWidget",
    collection: "XM.characteristics",
    orderBy: [
      {attribute: 'order'},
      {attribute: 'name'}
    ]
  });
  
  enyo.kind({
    name: "XV.CharacteristicItem",
    kind: "FittableColumns",
    published: {
      value: null
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "XV.CharacteristicPicker", attr: "chararteristic",
        showLabel: false},
      {kind: "XV.InputWidget", attr: "value", showLabel: false}
    ],
    controlValueChanged: function (inSender, inEvent) {
      var attr = inSender.getAttr(),
        value = inSender.getValue(),
        attributes = {},
        model = this.getValue();
      attributes[attr] = value;
      model.set(attributes);
      return true;
    },
    valueChanged: function () {
      var model = this.getValue(),
        characteristic = model.get('characteristic'),
        value = model.get('value');
      this.$.characteristicPicker.setValue(characteristic, {silent: true});
      this.$.inputWidget.setValue(value, {silent: true});
    }
  });

  enyo.kind({
    name: "XV.CharacteristicsWidget",
    //kind: "XV.Groupbox",
    published: {
      attr: null,
      value: null
    },
    components: [
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.CharacteristicItem"}
      ]},
      {kind: "FittableColumns", components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newItem",
          content: "_new".loc()},
        {kind: "onyx.Button", name: "deleteButton", onclick: "deleteItem",
          content: "_delete".loc(), disabled: true}
      ]}
    ],
/*
    deleteItem: function (inSender, inEvent) {
      //inEvent.originator.parent.getModel().destroy();
      //this.$.repeater.setCount(this._collection.length);
    },
    newItem: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        model = new Klass(null, { isNew: true });
      this._collection.add(model);
      this.$.repeater.setCount(this._collection.length);
    },
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
    setupItem: function (inSender, inEvent) {
      var item = inEvent.item.$.characteristicItem,
        model = this.readyModels()[inEvent.index];
      item.setValue(model);
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
