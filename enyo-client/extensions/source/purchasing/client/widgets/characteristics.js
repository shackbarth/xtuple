/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict: false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.purchasing.initCharacteristicWidgets = function () {

    // ..........................................................
    // PURCHASE ORDER
    //

    enyo.kind({
      name: "XV.PurchaseOrderCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.PurchaseOrderCharacteristic",
      which: "isPurchaseOrders"
    });

    // ..........................................................
    // PURCHASE ORDER LINE
    //

    enyo.kind({
      name: "XV.PurchaseOrderLineCharacteristicItem",
      kind: "XV.CharacteristicItem",
      components: [
        {kind: "XV.ComboboxWidget", name: "combobox", attr: "value", style: "width: 300px"},
      ],  
      disabledChanged: function (oldValue) {
        this.$.combobox.setDisabled(this.disabled);
      },
      /**
        Look at the characteristic of this model, and look at the characteristics of the item
        to pass to the combobox not just the value that has been changed but a dropdown
        collection that represents all of the item's characteristic values possible for this
        characteristic.
       */
      valueChanged: function (inSender, inEvent) {
        var model = this.getValue(),
          characteristic = model.getValue("characteristic"),
          characteristicId = characteristic.id,
          characteristicName = characteristic.get("name"),
          line = model.collection.purchaseOrderLine,
          allItemCharacteristics = line.getValue("item.characteristics"),
          // filter for only the models of the appropriate characteristic
          // allItemCharacteristics may be "", in which case we want an empty array
          // we can use this underscore method in backbone but it unfortunately
          // returns an array of models instead of a collection
          relevantArray = allItemCharacteristics ? allItemCharacteristics.filter(function (model) {
            return model.getValue("characteristic.id") === characteristicId;
          }) : [],
          // so we have to make it a collection here
          relevantItemCharacteristics = new XM.CharacteristicCollection(relevantArray);

        // pass the backing collection to the combobox
        this.$.combobox.setCollection(relevantItemCharacteristics);

        // for this type of characteristic, the label is just a label and not a picker
        this.$.combobox.setLabel(characteristicName);

        // set the selected value of the combobox
        this.$.combobox.setValue(model.get("value"), {silent: true});
      }
    });

    enyo.kind({
      name: "XV.PurchaseOrderLineCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.PurchaseOrderLineCharacteristic",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_characteristics".loc()},
        {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
          {kind: "XV.PurchaseOrderLineCharacteristicItem", name: "characteristicItem"}
        ]},
      ],
      /**
        Show even though we don't have a this.getWhich()
       */
      create: function () {
        this.inherited(arguments);
        // just undo the super-class function.
        this.show();
      },
      disabledChanged: function () {
        // Over-ride: there is no "new" button here.
      }
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeCharacteristicsWidget",
      kind: "XV.CharacteristicsWidget",
      model: "XM.PurchaseTypeCharacteristic",
      which: "isPurchaseOrders"
    });

  };

}());
