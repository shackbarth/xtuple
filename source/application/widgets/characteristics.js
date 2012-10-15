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
  
}());
