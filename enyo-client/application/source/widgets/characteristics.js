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
      {name: "label"},
      {kind: "XV.QuoteLineCharacteristicCombobox", name: "combobox", attr: "value", showLabel: false}
    ],
    valueChanged: function (inSender, inEvent) {
      var model = this.getValue(),
        value = model.get('value'),
        itemCharacteristics = model.collection.quoteLine.getValue("itemSite.item.characteristics"),
        //values = _.map(itemCharacteristics.models, function (chr) {return chr.get("value");}),
        characteristic = model.getValue('characteristic'),
        //options = characteristic.getValue('options'),
        characteristicName = characteristic.getValue('name');

      this.$.combobox.setCollection(itemCharacteristics); // options??

      this.$.combobox.setLabel(characteristicName);
      this.$.combobox.setValue(value, {silent: true});
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
