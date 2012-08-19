/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, window:true, enyo:true, _:true */

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
    label: "_name".loc(),
    list: "XV.ContactList",
    keyAttribute: "name",
    nameAttribute: "jobTitle",
    descripAttribute: "phone",
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {name: 'input', kind: "onyx.Input", classes: "xv-subinput",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", src: "assets/relation-icon-search.png"},
            {name: 'popupMenu', kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: 'searchItem', content: "_search".loc()},
              {kind: "XV.MenuItem", name: 'openItem', content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: 'newItem', content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {kind: "onyx.MenuDecorator", classes: "xv-relationwidget-completer",
            onSelect: "relationSelected", components: [
            {kind: "onyx.Menu", name: "autocompleteMenu", modal: false}
          ]}
        ]}
      ]},
      {kind: "FittableColumns", components: [
        {name: "labels", classes: "xv-relationwidget-column left",
          components: [
          {name: "jobTitleLabel", content: "_jobTitle".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "phoneLabel", content: "_phone".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "alternateLabel", content: "_alternate".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "faxLabel", content: "_fax".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "primaryEmailLabel", content: "_email".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false},
          {name: "webAddressLabel", content: "_phone".loc() + ":",
            classes: "xv-relationwidget-description label",
            showing: false}
        ]},
        {name: "data", fit: true, components: [
          {name: "name", classes: "xv-relationwidget-description hasLabel"},
          {name: "description", classes: "xv-relationwidget-description hasLabel"},
          {name: "alternate", classes: "xv-relationwidget-description hasLabel"},
          {name: "fax", classes: "xv-relationwidget-description hasLabel"},
          {name: "primaryEmail", ontap: "sendMail",
            classes: "xv-relationwidget-description hasLabel hyperlink"},
          {name: "webAddress", ontap: "openWindow",
            classes: "xv-relationwidget-description hasLabel hyperlink"}
        ]}
      ]}
    ],
    disabledChanged: function () {
      this.inherited(arguments);
      var disabled = this.getDisabled();
      if (this.$.phone) {
        this.$.jobTitle.addRemoveClass("disabled", disabled);
        this.$.phone.addRemoveClass("disabled", disabled);
        this.$.alternate.addRemoveClass("disabled", disabled);
        this.$.fax.addRemoveClass("disabled", disabled);
        this.$.primaryEmail.addRemoveClass("disabled", disabled);
        this.$.webAddress.addRemoveClass("disabled", disabled);
      }
    },
    setValue: function (value, options) {
      this.inherited(arguments);
      if (!value) { return; }
      var jobTitle = value.get('jobTitle'),
        phone = value.get('phone'),
        alternate = value.get('alternate'),
        fax = value.get('fax'),
        primaryEmail = value.get('primaryEmail'),
        webAddress = value.get('webAddress');
      if (value && value.get) {
        this.$.jobTitleLabel.setShowing(jobTitle);
        this.$.phoneLabel.setShowing(phone);
        this.$.alternate.setShowing(alternate);
        this.$.alternate.setContent(alternate);
        this.$.alternateLabel.setShowing(alternate);
        this.$.fax.setShowing(fax);
        this.$.fax.setContent(fax);
        this.$.faxLabel.setShowing(fax);
        this.$.primaryEmail.setShowing(primaryEmail);
        this.$.primaryEmail.setContent(primaryEmail);
        this.$.primaryEmailLabel.setShowing(primaryEmail);
        this.$.webAddress.setShowing(webAddress);
        this.$.webAddress.setContent(webAddress);
        this.$.webAddressLabel.setShowing(webAddress);
      }
    },
    openWindow: function () {
      var address = this.value ? this.value.get('webAddress') : null;
      if (address) { window.open('http://' + address); }
      return true;
    },
    sendMail: function () {
      var email = this.value ? this.value.get('primaryEmail') : null,
        win;
      if (email) {
        win = window.open('mailto:' + email);
        win.close();
      }
      return true;
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
