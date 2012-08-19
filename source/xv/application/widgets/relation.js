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
    list: "XV.AccountList"
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactWidget",
    kind: "XV.RelationWidget",
    list: "XV.ContactList",
    keyAttribute: "name",
    nameAttribute: "jobTitle",
    componentExtension: [
      {name: "phone", classes: "xv-relationwidget-description"},
      {name: "fax", classes: "xv-relationwidget-description"},
      {name: "email", classes: "xv-relationwidget-description"}
    ],
    create: function () {
      this.inherited(arguments);
      this.processComponentExtension();
    },
    processComponentExtension: function () {
      var i,
        field;
      for (i = 0; i < this.componentExtension.length; i++) {
        field = this.componentExtension[i];
        this.createComponent(field);
      }
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      if (value && value.get) {
        this.$.phone.setContent("Phone: " + value.get("phone"));
        this.$.phone.setShowing(value.get("phone"));
        this.$.fax.setContent("Fax: " + value.get("fax"));
        this.$.fax.setShowing(value.get("fax"));
        this.$.email.setContent("Email: " + value.get("primaryEmail"));
        this.$.email.setShowing(value.get("primaryEmail"));
      }
    }
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentWidget",
    kind: "XV.RelationWidget",
    list: "XV.IncidentList",
    nameAttribute: "description"
  });

  // ..........................................................
  // ITEM
  //

  enyo.kind({
    name: "XV.ItemWidget",
    kind: "XV.RelationWidget",
    list: "XV.ItemList",
    nameAttribute: "description1",
    descripAttribute: "description2"
  });

  // ..........................................................
  // USER ACCOUNT
  //

  enyo.kind({
    name: "XV.UserAccountWidget",
    kind: "XV.RelationWidget",
    list: "XV.UserAccountList",
    keyAttribute: "username",
    nameAttribute: "properName"
  });

}());
