/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //
  
  enyo.kind({
    name: "XV.AccountWidget",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.AccountInfoCollection"
    }
  });

  // ..........................................................
  // INCIDENT
  //
  
  enyo.kind({
    name: "XV.IncidentWidget",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.IncidentInfoCollection",
      nameAttribute: "description"
    }
  });
 
  // ..........................................................
  // ITEM
  //
  
  enyo.kind({
    name: "XV.ItemWidget",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.ItemInfoCollection",
      nameAttribute: "description1",
      descripAttribute: "description2"
    }
  });
  
  // ..........................................................
  // USER ACCOUNT
  //
  
  enyo.kind({
    name: "XV.UserAccountWidget",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.UserAccountInfoCollection",
      keyAttribute: "username",
      nameAttribute: "properName"
    }
  });
  
}());
