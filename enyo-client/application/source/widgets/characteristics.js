/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.AccountCharacteristic",
    which: "isAccounts"
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.ContactCharacteristic",
    which: "isContacts"
  });

  // ..........................................................
  // CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.CustomerCharacteristic",
    which: "isCustomers"
  });

  // ..........................................................
  // EMPLOYEE
  //

  enyo.kind({
    name: "XV.EmployeeCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.EmployeeCharacteristic",
    which: "isEmployees"
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.IncidentCharacteristic",
    which: "isIncidents"
  });

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.ItemCharacteristic",
    which: "isItems"
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.OpportunityCharacteristic",
    which: "isOpportunities"
  });

  // ..........................................................
  // ORDER (ABSTRACT)
  //

  enyo.kind({
    name: "XV.OrderCharacteristicItem",
    kind: "XV.CharacteristicItem",
    components: [
      {kind: "XV.ComboboxWidget", name: "combobox", attr: "value"}
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
        line = model.collection[this.parent.parent.parent.getParentKey()],
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
    name: "XV.OrderCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.PurchaseOrderLineCharacteristic",
    published: {
      parentKey: null
    },
    components: [
      {kind: "onyx.GroupboxHeader", content: "_characteristics".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.OrderCharacteristicItem", name: "characteristicItem"}
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
  // QUOTE LINE
  //

  enyo.kind({
    name: "XV.QuoteLineCharacteristicItem",
    kind: "XV.CharacteristicItem",
    components: [
      {kind: "XV.QuoteLineCharacteristicCombobox", name: "combobox", attr: "value", showLabel: false},
      {name: "price"}
    ],
    disabledChanged: function (oldValue) {
      this.$.combobox.setDisabled(this.disabled);
    },
    /**
      The price display is bound to the price attribute of the model, although we only want
      to show it if the quote line's item isSold
     */
    priceChanged: function () {
      var model = this.getValue(),
        line = model.collection.quoteLine ? model.collection.quoteLine : model.collection.salesOrderLine,
        itemIsSold = line.getValue("item.isSold"),
        price = model.get("price") !== undefined ? model.get("price") : "",
        note = itemIsSold ? Globalize.format(price, "c") : "";

      this.$.combobox.setNote(note);
    },
    /**
      Remove bindings
     */
    destroy: function () {
      this.getValue().off("change:price", this.priceChanged, this);
      this.inherited(arguments);
    },
    /**
      Look at the characteristic of this model, and look at the characteristics of the item
      to pass to the combobox not just the value that has been changed but a dropdown
      collection that represents all of the item's characteristic values possible for this
      characteristic.
     */
    valueChanged: function (inSender, inEvent) {
      var model = this.getValue(),
        characteristic = model.getValue('characteristic'),
        characteristicId = characteristic.id,
        characteristicName = characteristic.get('name'),
        // this could be quoteLine or a salesOrderLine
        line = model.collection.quoteLine ? model.collection.quoteLine : model.collection.salesOrderLine,
        allItemCharacteristics = line.getValue("item.characteristics"),
        // filter for only the models of the appropriate characteristic
        // allItemCharacteristics may be "", in which case we want an empty array
        // we can use this underscore method in backbone but it unfortunately
        // returns an array of models instead of a collection
        relevantArray = allItemCharacteristics ? allItemCharacteristics.filter(function (model) {
          return model.getValue("characteristic.id") === characteristicId;
        }) : [],
        // so we have to make it a collection here
        relevantItemCharacteristics = new XM.CharacteristicCollection(relevantArray),
        itemIsSold = line.getValue("item.isSold");

      // pass the backing collection to the combobox
      this.$.combobox.setCollection(relevantItemCharacteristics);

      // for this type of characteristic, the label is just a label and not a picker
      this.$.combobox.setLabel(characteristicName);

      // set the selected value of the combobox
      this.$.combobox.setValue(model.get('value'), {silent: true});

      // display the price if we already have it
      this.priceChanged();

      // bind the price label to the price attribute on the model
      this.getValue().on("change:price", this.priceChanged, this);
    }
  });

  enyo.kind({
    name: "XV.QuoteLineCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.QuoteLineCharacteristic",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_characteristics".loc()},
      {kind: "Repeater", count: 0, onSetupItem: "setupItem", components: [
        {kind: "XV.QuoteLineCharacteristicItem", name: "characteristicItem"}
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
    },
    setValue: function (value) {
      this.inherited(arguments);

      // TODO: hide it if there are no characteristics to show
      // this doesn't quite work yet
      //if (value
      //    && value.quoteLine
      //    && value.quoteLine.getValue("itemSite.item.characteristics")
      //    && value.quoteLine.getValue("itemSite.item.characteristics").length) {
      //  this.show();
      //} else {
      //  this.hide();
      //}
    }
  });

  // ..........................................................
  // SALE TYPE
  //

  enyo.kind({
    name: "XV.SaleTypeCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.SaleTypeCharacteristic",
    which: "isSalesOrders" // not a bug
  });

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.SalesOrderCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.SalesOrderCharacteristic",
    which: "isSalesOrders"
  });

}());
