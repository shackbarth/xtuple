/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  
  enyo.kind({
    name: "XV.AccountCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.AccountCharacteristic",
    which: "isAccounts"
  });
  
  enyo.kind({
    name: "XV.ContactCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.ContactCharacteristic",
    which: "isContacts"
  });
  
  enyo.kind({
    name: "XV.IncidentCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.IncidentCharacteristic",
    which: "isIncidents"
  });
  
  enyo.kind({
    name: "XV.ItemCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.ItemCharacteristic",
    which: "isItems"
  });
  
  enyo.kind({
    name: "XV.OpportunityCharacteristicsWidget",
    kind: "XV.CharacteristicsWidget",
    model: "XM.OpportunityCharacteristic",
    which: "isOpportunities"
  });
  
}());
