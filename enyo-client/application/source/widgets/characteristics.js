/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

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
  // QUOTE LINE
  //

  enyo.kind({
    name: "XV.QuoteLineCharacteristicItem",
    kind: "XV.CharacteristicItem",
    components: [
      {kind: "XV.QuoteLineCharacteristicCombobox", name: "combobox", attr: "value", showLabel: false},
      {name: "price"}
    ],
    /**
      The price display is bound to the price attribute of the model, although we only want
      to show it if the quote line's item isSold
     */
    priceChanged: function () {
      var model = this.getValue(),
        quoteLine = model.collection.quoteLine,
        itemIsSold = quoteLine.getValue("itemSite.item.isSold"),
        note = itemIsSold ? Globalize.format( model.get("price"), "c" ) : "";

      console.log("setting " + model.getValue("characteristic.id")
      + " price of " + model.get("price")  +
      " for ", this.$.combobox && this.$.combobox.getLabel(), this.id);
      if (this.$.combobox) {
        this.$.combobox.setNote(note);
      }
    },
    controlValueChanged: function (inSender, inEvent) {
      var model = this.getValue(),
        quoteLine = model.collection.quoteLine,
        itemIsSold = quoteLine.getValue("itemSite.item.isSold"),
        note = itemIsSold ? Globalize.format( model.get("price"), "c" ) : "";

      this.inherited(arguments);

      this.$.combobox.setNote(note);
      return true;
    },
    /**
      Look at the characteristic of this model, and look at the characteristics of the item
      to pass to the combobox not just the value that has been changed but a dropdown
      collection that represents all of the item's characteristic values possible for this
      characteristic.
     */
    valueChanged: function (inSender, inEvent) {
      var model = this.getValue(),
        value = model.get('value'),
        characteristic = model.getValue('characteristic'),
        characteristicId = characteristic.get('id'),
        characteristicName = characteristic.get('name'),
        quoteLine = model.collection.quoteLine,
        allItemCharacteristics = quoteLine.getValue("itemSite.item.characteristics"),
        // filter for only the models of the appropriate characteristic
        // allItemCharacteristics may be "", in which case we want an empty array
        // we can use this underscore method in backbone but it unfortunately
        // returns an array of models instead of a collection
        relevantArray = allItemCharacteristics ? allItemCharacteristics.filter(function (model) {
          return model.getValue("characteristic.id") === characteristicId
        }) : [],
        // so we have to make it a collection here
        relevantItemCharacteristics = new XM.CharacteristicCollection(relevantArray),
        itemIsSold = quoteLine.getValue("itemSite.item.isSold");

      // pass the backing collection to the combobox
      this.$.combobox.setCollection(relevantItemCharacteristics);

      // for this type of characteristic, the label is just a label and not a picker
      this.$.combobox.setLabel(characteristicName);

      // set the selected value of the combobox
      this.$.combobox.setValue(value, {silent: true});

      // put the price alongside the value if the item isSold
      //this.$.combobox.setNote(itemIsSold ? model.get("price") : "");

      console.log("binding " + characteristicId + " to ", this.$.combobox.getLabel(), this.id);
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
    }
  });

}());
