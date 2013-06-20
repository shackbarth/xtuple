/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
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
    title: "_taxRegistration".loc(),
    editor: "XV.TaxRegistrationEditor",
    parentKey: "customer",
    listRelations: "XV.TaxRegistrationListRelations"
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
        {kind: "XV.MoneyWidget", attr: {localValue: "budgetedExpenses"},
         label: "_budgeted".loc(), currencyShowing: false},
        {kind: "XV.MoneyWidget", attr: {localValue: "actualExpenses"},
         label: "_actual".loc(), currencyShowing: false},
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
  // LINE ITEMS
  //

  /**
    This is the parent LineItem Mixin for both the Quote and SalesOrder.
  */
  XV.LineMixin = {
    /**
     When the model changes, check the priceMode field to see if it is in
       Discount or Markup mode and change the label accordingly.
    */
    attributesChanged: function (model, options) {
      XV.EditorMixin.attributesChanged.apply(this, arguments);
      var pm = model.get("priceMode");
      if (this.$.discount) {
        if (pm === "N" || pm === "D" || pm === "P") { // discount
          this.$.discount.setLabel("_discount".loc());
        } else { // markup
          this.$.discount.setLabel("_markup".loc());
        }
      }
    },
    changeItemSiteParameter: function (attr, param, isParent) {
      param = param ? param : attr;
      isParent = _.isBoolean(isParent) ? isParent : true;
      var model = this.getValue(),
       parent = model ? model.getParent() : false,
       value = isParent && parent ? parent.get(attr) :
         (model ? model.get(attr) : false);
      if (value) {
        this.$.itemSiteWidget.addParameter({
          attribute: param,
          value: value
        });
      } else {
        this.$.itemSiteWidget.removeParameter(param);
      }
    },
    shiptoChanged: function () {
      this.changeItemSiteParameter("shipto");
    },
    scheduleDateChanged: function () {
      this.changeItemSiteParameter("scheduleDate", "effectiveDate", false);
    },
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.getValue(),
        sellingUnits = model ? model.sellingUnits : false;
      if (sellingUnits) {
        this.$.quantityUnitPicker.setCollection(sellingUnits);
        this.$.priceUnitPicker.setCollection(sellingUnits);
      }
    }
  };

  /**
    Mixin for Quote Specific Line functions
  */
  XV.QuoteLineMixin = {
    create: function () {
      this.inherited(arguments);
      this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));

      // Loop through the components and set the specific attribute information for the Money widgets
      this.getComponents().forEach(function (e) {
        if (e.kind === "XV.MoneyWidget") {
          e.attr.currency = "quote.currency";
          if (e.getEffective()) {
            e.setEffective("quote.quoteDate");
          }
        }
      });
    },
    quoteDateChanged: function () {
      this.changeItemSiteParameter("quoteDate", "effectiveDate");
    },
    setValue: function (value) {
      var parent,
       site,
       effectivePolicy = XT.session.settings.get("soPriceEffective");
      // Remove any old bindings
      if (this.value) {
        parent = value.getParent();
        parent.off("change:shipto", this.shiptoChanged, this);
        parent.off("change:quoteDate", this.quoteDateChanged, this);
        this.value.off("change:scheduleDate", this.scheduleDateChanged, this);
      }
      XV.EditorMixin.setValue.apply(this, arguments);
      // Add new bindings
      if (this.value) {
        parent = value.getParent();
        parent.on("change:shipto", this.shiptoChanged, this);
        if (effectivePolicy === "OrderDate") {
          parent.on("change:quoteDate", this.quoteDateChanged, this);
          this.changeItemSiteParameter("quoteDate", "effectiveDate");
        } else if (effectivePolicy === "ScheduleDate") {
          this.value.on("change:scheduleDate", this.scheduleDateChanged, this);
          this.changeItemSiteParameter("scheduleDate", "effectiveDate");
        }
        site = parent ? parent.get("site") : false;
        if (site) { this.$.itemSiteWidget.setSelectedSite(site); }
      }
      this.changeItemSiteParameter("customer");
      this.changeItemSiteParameter("shipto");
    }
  };

  /**
    Mixin for Sales Order Specific Line functions
  */
  XV.SalesOrderLineMixin = {
    create: function () {
      this.inherited(arguments);
      this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));

      // Loop through the components and set the specific attribute information for the Money widgets
      this.getComponents().forEach(function (e) {
        if (e.kind === "XV.MoneyWidget") {
          e.attr.currency = "order.currency";
          if (e.getEffective()) {
            e.setEffective("order.orderDate");
          }
        }
      });
    },
    salesOrderDateChanged: function () {
      this.changeItemSiteParameter("orderDate", "effectiveDate");
    },
    setValue: function (value) {
      var parent, site, effectivePolicy = XT.session.settings.get("soPriceEffective");
           // Remove any old bindings
      if (this.value) {
        parent = value.getParent();
        parent.off("change:shipto", this.shiptoChanged, this);
        parent.off("change:orderDate", this.salesOrderDateChanged, this);
        this.value.off("change:scheduleDate", this.scheduleDateChanged, this);
      }
      XV.EditorMixin.setValue.apply(this, arguments);
      // Add new bindings
      if (this.value) {
        parent = value.getParent();
        parent.on("change:shipto", this.shiptoChanged, this);
        if (effectivePolicy === "OrderDate") {
          parent.on("change:orderDate", this.salesOrderDateChanged, this);
          this.changeItemSiteParameter("orderDate", "effectiveDate");
        } else if (effectivePolicy === "ScheduleDate") {
          this.value.on("change:scheduleDate", this.scheduleDateChanged, this);
          this.changeItemSiteParameter("scheduleDate", "effectiveDate");
        }
        site = parent ? parent.get("site") : false;
        if (site) {
          this.$.itemSiteWidget.setSelectedSite(site);
        }
      }
      this.changeItemSiteParameter("customer");
      this.changeItemSiteParameter("shipto");
    }
  };

   /**
     This is the parent line editor. It mixes in the base line functionality
     for both
   */
  var lineEditor = {
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.NumberWidget", attr: "lineNumber"},
        {kind: "XV.ItemSiteWidget", attr: "itemSite",
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}},
        {kind: "XV.QuantityWidget", attr: "quantity"},
        {kind: "XV.UnitPicker", attr: "quantityUnit",
          name: "quantityUnitPicker"},
        {kind: "XV.PercentWidget", name: "discount", attr: "discount",
          label: "_discount".loc()},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "price", currency: ""},
          label: "_price".loc(), currencyDisabled: true,
          scale: XT.SALES_PRICE_SCALE},
        {kind: "XV.UnitPicker", attr: "priceUnit",
          name: "priceUnitPicker"},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "extendedPrice", currency: ""},
          label: "_extendedPrice".loc(), currencyDisabled: true,
          scale: XT.EXTENDED_PRICE_SCALE},
        {kind: "XV.DateWidget", attr: "scheduleDate"},
        {kind: "XV.DateWidget", name: "promiseDate", attr: "promiseDate",
          showing: false},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  };
  enyo.mixin(lineEditor, XV.LineMixin);

  var quoteLineEditor = {name: "XV.QuoteLineItemEditor"};
  enyo.mixin(quoteLineEditor, lineEditor);
  enyo.mixin(quoteLineEditor, XV.QuoteLineMixin);
  enyo.kind(quoteLineEditor);

  var salesOrderLineEditor = {name: "XV.SalesOrderLineItemEditor"};
  enyo.mixin(salesOrderLineEditor, lineEditor);
  enyo.mixin(salesOrderLineEditor, XV.SalesOrderLineMixin);
  enyo.kind(salesOrderLineEditor);

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
      // create extra "expand" button for sales line items
      this.$.navigationButtonPanel.createComponents([
        {kind: "onyx.Button", content: "_expand".loc(),
            name: "expandButton", ontap: "launchWorkspace",
            classes: "xv-groupbox-button-right",
            container: this.$.navigationButtonPanel
        }
      ], {owner: this});

      // create summary panel with totals
      this.createComponents([
        {kind: "XV.SalesSummaryPanel", name: "summaryPanel"}
      ], {owner: this});
    },

    disabledChanged: function () {
      this.inherited(arguments);
      this.$.expandButton.setDisabled(this.getDisabled());
    },
    /**
      Set the current model into Summary Panel and set styling for done button
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.quote || this.value.salesOrder;
      this.$.summaryPanel.setValue(model);
      // change the styling of the last button to make room for the new button
      this.$.doneButton.setClasses("xv-groupbox-button-center");
    },

    launchWorkspace: function (inSender, inEvent) {
      var index = Number(this.$.list.getFirstSelected());
      this.doChildWorkspace({
        workspace: "XV.QuoteLineWorkspace",
        collection: this.getValue(),
        index: index,
        listRelations: this.$.list
      });
      return true;
    }
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemBox",
    kind: "XV.QuoteLineItemBox",
    editor: "XV.SalesOrderLineItemEditor",
    parentKey: "salesOrder",
    listRelations: "XV.SalesOrderLineItemListRelations",

    launchWorkspace: function (inSender, inEvent) {
      var index = Number(this.$.list.getFirstSelected());
      this.doChildWorkspace({
        workspace: "XV.SalesOrderLineWorkspace",
        collection: this.getValue(),
        index: index,
        listRelations: this.$.list
      });
      return true;
    }
  });

  enyo.kind({
    name: "XV.SalesSummaryPanel",
    kind: "XV.RelationsEditor",
    style: "margin-top: 10px;",
    components: [
      {kind: "XV.Groupbox", name: "totalGroup", components: [
        {kind: "onyx.GroupboxHeader", content: "_summary".loc()},
        {kind: "FittableColumns", name: "totalBox", classes: "xv-totals-panel", components: [
          {kind: "FittableRows", name: "summaryColumnOne", components: [
            {kind: "XV.CurrencyPicker", attr: "currency"},
            {kind: "XV.MoneyWidget", attr: {localValue: "margin", currency: "currency"},
             label: "_margin".loc(), currencyShowing: false},
            {kind: "XV.WeightWidget", attr: "freightWeight"}
          ]},
          {kind: "FittableRows", name: "summaryColumnTwo", components: [
            {kind: "XV.MoneyWidget",
             attr: {localValue: "subtotal", currency: "currency"},
             label: "_subtotal".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "miscCharge", currency: "currency"},
             label: "_miscCharge".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "freight", currency: "currency"},
             label: "_freight".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
             attr: {localValue: "taxTotal", currency: "currency"},
             label: "_tax".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
             attr: {localValue: "total", currency: "currency"},
             label: "_total".loc(), currencyShowing: false}
          ]}
        ]}
      ]}
    ]
  });

}());
