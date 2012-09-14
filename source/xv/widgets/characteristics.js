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
    collection: "XM.characteristics"
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
        {kind: "XV.CharacteristicPicker"},
        {kind: "XV.InputWidget"}
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
    setImageSource: function (inSender, inEvent) {
      var item = inEvent.item.$.repeaterItem,
        model = this.readyModels()[inEvent.index],
        characteristic = model.get('characteristic'),
        value = model.get('value');
      item.$.characteristicPicker.setValue(characteristic);
      item.$.inputWidget.setValue(value);
    },
    valueChanged: function () {
      this.$.repeater.setCount(this.readyModels().length);
    }

  });

}());
