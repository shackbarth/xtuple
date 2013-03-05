/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // CHARACTERISTIC
  //
  enyo.kind({
    name: "XV.CharacteristicOptionEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
      classes: "in-panel", style: "border-right: #aaa 1px solid;", components: [
        {kind: "XV.InputWidget", attr: "value", classes: "editor-field"},
        {kind: "XV.NumberWidget", attr: "order", classes: "editor-field"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.CharacteristicOptionBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_options".loc(),
    editor: "XV.CharacteristicOptionEditor",
    parentKey: "characteristic",
    listRelations: "XV.CharacteristicOptionListRelations",
    fitButtons: false
  });

  // ..........................................................
  // CONTACT
  //
  enyo.kind({
    name: "XV.ContactEmailEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "email"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ContactEmailBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_emailAddresses".loc(),
    editor: "XV.ContactEmailEditor",
    parentKey: "contact",
    listRelations: "XV.ContactEmailListRelations"
  });

  // ..........................................................
  // CUSTOMER SHIP-TO
  //
  enyo.kind({
    name: "XV.CustomerShipToEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.CheckboxWidget", attr: "isActive"},
        {kind: "XV.CheckboxWidget", attr: "isDefault"},
        {kind: "onyx.GroupboxHeader", content: "_address".loc()},
        {kind: "XV.AddressWidget", attr: "address"},
        {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
        {kind: "XV.ContactWidget", attr: "contact", label: "_name".loc()},
        {kind: "onyx.GroupboxHeader", content: "_defaults".loc()},
        {kind: "XV.SalesRepPicker", attr: "salesRep"},
        {kind: "XV.NumberWidget", attr: "commission"},
        {kind: "XV.ShipZonePicker", attr: "shipZone"},
        {kind: "XV.TaxZonePicker", attr: "taxZone"},
        {kind: "XV.ShipViaCombobox", attr: "shipVia"},
        {kind: "XV.ShippingChargePicker", attr: "shipCharge"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.CustomerShipToBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_shipTo".loc(),
    editor: "XV.CustomerShipToEditor",
    parentKey: "customer",
    listRelations: "XV.CustomerShipToListRelations",
    fitButtons: false
  });

  // ..........................................................
  // TAX REGISTRATIONS
  //
  enyo.kind({
    name: "XV.TaxRegistrationEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.TaxAuthorityPicker", attr: "taxAuthority"},
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.TaxZonePicker", attr: "taxZone"},
        {kind: "XV.DateWidget", attr: "effective"},
        {kind: "XV.DateWidget", attr: "expires"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.TaxRegistrationBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-short-relations-box",
    title: "_taxRegistration".loc(),
    editor: "XV.TaxRegistrationEditor",
    parentKey: "customer",
    listRelations: "XV.TaxRegistrationListRelations",
    fitButtons: false
  });

  // ..........................................................
  // PROJECT
  //
  enyo.kind({
    name: "XV.ProjectTaskEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.ProjectStatusPicker", attr: "status"},
        {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
        {kind: "XV.DateWidget", attr: "dueDate"},
        {kind: "XV.DateWidget", attr: "startDate"},
        {kind: "XV.DateWidget", attr: "assignDate"},
        {kind: "XV.DateWidget", attr: "completeDate"},
        {kind: "onyx.GroupboxHeader", content: "_hours".loc()},
        {kind: "XV.QuantityWidget", attr: "budgetedHours",
          label: "_budgeted".loc()},
        {kind: "XV.QuantityWidget", attr: "actualHours",
          label: "_actual".loc()},
        {kind: "onyx.GroupboxHeader", content: "_expenses".loc()},
        {kind: "XV.NumberWidget", attr: "budgetedExpenses", scale: XT.MONEY_SCALE,
          label: "_budgeted".loc()},
        {kind: "XV.NumberWidget", attr: "actualExpenses", scale: XT.MONEY_SCALE,
          label: "_actual".loc()},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {kind: "XV.UserAccountWidget", attr: "owner"},
        {kind: "XV.UserAccountWidget", attr: "assignedTo"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ProjectTasksBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-list-relations-box",
    title: "_projectTasks".loc(),
    editor: "XV.ProjectTaskEditor",
    parentKey: "project",
    listRelations: "XV.ProjectTaskListRelations",
    fitButtons: false
  });

  // ..........................................................
  // QUOTE LINE ITEMS
  //
  enyo.kind({
    name: "XV.QuoteLineItemEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.NumberWidget", attr: "lineNumber"},
        {kind: "XV.SitePicker", attr: "site"},
        {kind: "XV.InputWidget", attr: "customerPartNumber"},
        {kind: "XV.NumberWidget", attr: "quantity"},
        {kind: "XV.UnitWidget", attr: "quantityUnit"},
        {kind: "XV.PercentWidget", attr: "discount"},
        {kind: "XV.MoneyWidget", attr: {amount: "unitCost", currency: "quote.currency"},
          label: "_unitPrice".loc(), currencyDisabled: true},
        {kind: "XV.UnitWidget", attr: "priceUnit"},
        {kind: "XV.NumberWidget", attr: "extendedPrice"},
        {kind: "XV.DateWidget", attr: "scheduleDate"},
        {kind: "XV.DateWidget", attr: "promiseDate"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.QuoteLineItemBox",
    kind: "XV.ListRelationsEditorBox",
    classes: "xv-list-relations-box",
    events: {
      onChildWorkspace: ""
    },
    title: "_lineItems".loc(),
    editor: "XV.QuoteLineItemEditor",
    parentKey: "quote",
    listRelations: "XV.QuoteLineItemListRelations",
    fitButtons: false,

    create: function () {
      this.inherited(arguments);

      // Bottom Panel with calculations
      this.createComponent({
        kind: "XV.RelationsEditor", name: "pricePanel", style: "margin-top: 10px;", components: [
          //{kind: "onyx.GroupboxHeader", content: "_totals".loc()},
          {kind: "XV.ScrollableGroupbox", name: "priceGroup",
            classes: "in-panel", components: [
            {kind: "XV.CurrencyPickerWidget", attr: "currency"},
            {kind: "XV.NumberWidget", attr: "margin"},
            //{kind: "XV.TextArea", attr: "miscChargeDesc", fit: true} - needs GL
            // Charge Sales Account - needs GL
            {kind: "XV.NumberWidget", attr: "freightWeight"},
            {kind: "XV.MoneyWidget", attr: {amount: "subtotal", currency: "currency"},
              label: "_subtotal".loc(), currencyShowing: false},
            // {kind: "XV.NumberWidget", attr: "miscCharge"}, - needs GL
            {kind: "XV.NumberWidget", attr: "calculateFreight", label: "_freight".loc()},
            {kind: "XV.MoneyWidget", attr: {amount: "taxTotal", currency: "currency"},
              label: "_tax".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget", attr: {amount: "total", currency: "currency"},
              label: "_total".loc(), currencyShowing: false}
        ]}
      ]});

      this.createComponent({
        kind: "onyx.Button",
        content: "_expand".loc(),
        ontap: "launchWorkspace",
        container: this.$.navigationButtonPanel
      });
    },

    /**
    @todo Document overridden function
    */
    valueChanged: function () {
      var value = this.getValue();
      this.$.list.setValue(value);
    },

    launchWorkspace: function (inSender, inEvent) {
      var index = Number(this.$.list.getFirstSelected());
      this.doChildWorkspace({
        workspace: "XV.QuoteLineWorkspace",
        collection: this.getValue(),
        index: index,
        listRelations: this.$.list});
      return true;
    }
  });

}());
