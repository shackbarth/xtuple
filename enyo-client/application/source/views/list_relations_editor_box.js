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
  // CREDIT CARDS
  //
  enyo.kind({
    name: "XV.CreditCardsEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.InputWidget", attr: "address1"},
        {kind: "XV.InputWidget", attr: "address2"},
        {kind: "XV.InputWidget", attr: "city"},
        {kind: "XV.CountryCombobox", attr: "country", name: "country",
          onValueChange: "countryChanged" },
        {kind: "XV.StateCombobox", attr: "state", name: "state"},
        {kind: "XV.InputWidget", attr: "zip", label: "_postalCode".loc()},
        {kind: "XV.CreditCardTypePicker", attr: "creditCardType", label: "_type".loc()},
        {kind: "XV.CheckboxWidget", attr: "isDebit"},
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.MonthPicker", attr: "monthExpired"},
        {kind: "XV.YearPicker", attr: "yearExpired"},
        {kind: "XV.CheckboxWidget", attr: "isActive"},
        {kind: "XV.NumberWidget", attr: "sequence"}
      ]}
    ],
    /**
      When the country is changed we want to both do the typical event
      (to update the model) but also set the country of the state, which
      will limit its options.
    */
    countryChanged: function (inSender, inEvent) {
      var country = this.$.country.getValue();
      this.$.state.setCountry(country);
    },
  });

  enyo.kind({
    name: "XV.CreditCardsBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_creditCards".loc(),
    editor: "XV.CreditCardsEditor",
    parentKey: "customer",
    listRelations: "XV.CreditCardListRelations"
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
    classes: "small-panel",
    title: "_shipTo".loc(),
    editor: "XV.CustomerShipToEditor",
    parentKey: "customer",
    listRelations: "XV.CustomerShipToListRelations",
    fitButtons: false
  });

  // ..........................................................
  // INVOICE LINE
  //
  enyo.kind({
    name: "XV.InvoiceLineItemEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.NumberWidget", attr: "lineNumber"},
        {kind: "XV.ItemSiteWidget",
          attr: {item: "item", site: "site"},
          name: "itemSiteWidget"},
        {kind: "XV.QuantityWidget", attr: "quantity", name: "quantityWidget"},
        {kind: "XV.QuantityWidget", attr: "billed", name: "billedWidget"},
        {kind: "XV.UnitCombobox", attr: "quantityUnit", showLabel: true,
          name: "quantityUnitPicker"},
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
      ]}
    ]
  });
  enyo.kind({
    name: "XV.InvoiceLineItemBox",
    kind: "XV.ListRelationsEditorBox",
    childWorkspace: "XV.InvoiceLineWorkspace",
    classes: "xv-short-relations-box",
    title: "_lineItems".loc(),
    editor: "XV.InvoiceLineItemEditor",
    parentKey: "invoice",
    listRelations: "XV.InvoiceLineItemListRelations",
    fitButtons: false
  });

  // ..........................................................
  // INVOICE TAX ADJUSTMENT
  //
  enyo.kind({
    name: "XV.InvoiceTaxAdjustmentEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.TaxCodePicker", attr: "taxCode"},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "amount", currency: ""},
          label: "_amount".loc(), currencyDisabled: true,
          scale: XT.SALES_PRICE_SCALE}
      ]}
    ]
  });
  enyo.kind({
    name: "XV.InvoiceTaxAdjustmentBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_taxAdjustments".loc(),
    editor: "XV.InvoiceTaxAdjustmentEditor",
    parentKey: "invoice",
    listRelations: "XV.InvoiceTaxAdjustmentListRelations",
    fitButtons: false
  });


  // ..........................................................
  // ITEM ALIASES
  //
  enyo.kind({
    name: "XV.ItemAliasEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "aliasNumber", label: "_alias".loc()},
        {kind: "XV.AccountWidget", attr: "account" },
        {kind: "XV.CheckboxWidget", attr: "useDescription"},
        {kind: "XV.InputWidget", attr: "description1"},
        {kind: "XV.InputWidget", attr: "description2"},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes"}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ItemAliasBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_aliases".loc(),
    editor: "XV.ItemAliasEditor",
    parentKey: "item",
    listRelations: "XV.ItemAliasListRelations"
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
  // LINE ITEMS
  //

  /**
    This is the parent LineItem Mixin for both the Quote and SalesOrder.
  */
  XV.LineMixin = {
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
      if (this.$.promiseDate) {
        this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));
      }

      // Loop through the components and set the specific attribute
      // information for the Money widgets
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
       parentSite,
       childSite,
       effectivePolicy = XT.session.settings.get("soPriceEffective");
      // Remove any old bindings
      if (this.value) {
        parent = value.getParent();
        parent.off("change:shipto", this.shiptoChanged, this);
        parent.off("change:quoteDate", this.quoteDateChanged, this);
        this.value.off("change:scheduleDate", this.scheduleDateChanged, this);
      }
      // Add default bindings
      XV.RelationsEditor.prototype.setValue.apply(this, arguments);
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
        parentSite = parent ? parent.get("site") : false;
        childSite = this.$.itemSiteWidget.getSite();
        if (parentSite && !childSite) {
          this.$.itemSiteWidget.setSite(parentSite);
        }
      }
      this.changeItemSiteParameter("customer");
      this.changeItemSiteParameter("shipto");
    }
  };

  /**
    Mixin for Sales Order Specific Line functions
  */
  XV.SalesOrderLineMixin = {
    bind: XV.RelationsEditorMixin.bind,
    create: function () {
      this.inherited(arguments);
      if (this.$.promiseDate) {
        this.$.promiseDate.setShowing(XT.session.settings.get("UsePromiseDate"));
      }

      // Loop through the components and set the specific attribute information
      // for the Money widgets
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
      var parent, parentSite, childSite,
        effectivePolicy = XT.session.settings.get("soPriceEffective");

      // Remove any old bindings
      if (this.value) {
        parent = value.getParent();
        parent.off("change:shipto", this.shiptoChanged, this);
        parent.off("change:orderDate", this.salesOrderDateChanged, this);
        this.value.off("change:scheduleDate", this.scheduleDateChanged, this);
      }
      // this is what clears the itemsite widget name/description
      XV.RelationsEditor.prototype.setValue.apply(this, arguments);
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
        parentSite = parent ? parent.get("site") : false;
        childSite = this.$.itemSiteWidget.getSite();
        if (parentSite && !childSite) {
          this.$.itemSiteWidget.setSite(parentSite);
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
        {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
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
    title: "_lineItems".loc(),
    editor: "XV.QuoteLineItemEditor",
    parentKey: "quote",
    listRelations: "XV.QuoteLineItemListRelations",
    childWorkspace: "XV.QuoteLineWorkspace",
    fitButtons: false,

    create: function () {
      this.inherited(arguments);
      // create summary panel with totals
      this.createComponents([
        {kind: "XV.SalesSummaryPanel", name: "summaryPanel"}
      ], {owner: this});
    },

    /**
      Set the current model into Summary Panel and set styling for done button
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.quote || this.value.salesOrder;
      this.$.summaryPanel.setValue(model);
    }
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemBox",
    kind: "XV.QuoteLineItemBox",
    editor: "XV.SalesOrderLineItemEditor",
    parentKey: "salesOrder",
    listRelations: "XV.SalesOrderLineItemListRelations",
    childWorkspace: "XV.SalesOrderLineWorkspace",
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
            {kind: "XV.WeightWidget", attr: "freightWeight"},
            {kind: "XV.MoneyWidget", attr: {localValue: "allocatedCredit", currency: "currency"},
                label: "_allocatedCredit".loc(), currencyShowing: false}
          ]},
          {kind: "FittableRows", name: "summaryColumnTwo", components: [
            {kind: "XV.MoneyWidget",
             attr: {localValue: "subtotal", currency: "currency"},
             label: "_subtotal".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
              attr: {localValue: "miscCharge", currency: "currency"},
             label: "_miscCharge".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget", name: "taxTotal",
             attr: {localValue: "taxTotal", currency: "currency"},
             label: "_tax".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget",
             attr: {localValue: "total", currency: "currency"},
             label: "_total".loc(), currencyShowing: false},
            {kind: "XV.MoneyWidget", attr: {localValue: "balance", currency: "currency"},
                label: "_balance".loc(), currencyShowing: false}
          ]}
        ]}
      ]}
    ]
  });

  // ..........................................................
  // RETURN LINE
  //
  enyo.kind({
    name: "XV.ReturnLineItemEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.NumberWidget", attr: "lineNumber"},
        {kind: "XV.ItemSiteWidget",
          attr: {item: "item", site: "site"},
          name: "itemSiteWidget"},
        {kind: "XV.QuantityWidget", attr: "quantity", name: "quantityWidget"},
        {kind: "XV.QuantityWidget", attr: "credited", name: "creditedWidget"},
        {kind: "XV.UnitCombobox", attr: "quantityUnit", showLabel: true,
          name: "quantityUnitPicker"},
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
      ]}
    ]
  });
  enyo.kind({
    name: "XV.ReturnLineItemBox",
    kind: "XV.ListRelationsEditorBox",
    childWorkspace: "XV.ReturnLineWorkspace",
    classes: "xv-short-relations-box",
    title: "_lineItems".loc(),
    editor: "XV.ReturnLineItemEditor",
    parentKey: "return",
    listRelations: "XV.ReturnLineItemListRelations",
    fitButtons: false
  });

  // ..........................................................
  // RETURN TAX ADJUSTMENT
  //
  enyo.kind({
    name: "XV.ReturnTaxAdjustmentEditor",
    kind: "XV.InvoiceTaxAdjustmentEditor"
  });
  enyo.kind({
    name: "XV.ReturnTaxAdjustmentBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_taxAdjustments".loc(),
    editor: "XV.ReturnTaxAdjustmentEditor",
    parentKey: "return",
    listRelations: "XV.ReturnTaxAdjustmentListRelations",
    fitButtons: false
  });

  // ..........................................................
  // SALE TYPE AND SALES ORDER WORKFLOW
  //
  enyo.kind({
    name: "XV.SaleTypeWorkflowEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.InputWidget", attr: "description"},
        {kind: "XV.WorkflowStatusPicker", attr: "status"},
        {kind: "XV.SalesOrderWorkflowTypePicker", attr: "workflowType" },
        {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
        {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
        {kind: "onyx.GroupboxHeader", content: "_startDate".loc()},
        {kind: "XV.ToggleButtonWidget", attr: "startSet"},
        {kind: "XV.NumberSpinnerWidget", attr: "startOffset"},
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {kind: "XV.ToggleButtonWidget", attr: "dueSet"},
        {kind: "XV.NumberSpinnerWidget", attr: "dueOffset"},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {kind: "XV.UserAccountWidget", attr: "owner"},
        {kind: "XV.UserAccountWidget", attr: "assignedTo"},
        {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
        {kind: "XV.HoldTypePicker", attr: "completedParentStatus",
          label: "_nextHoldType".loc()},
        {kind: "XV.DependenciesWidget",
          attr: {workflow: "parent.workflow", successors: "completedSuccessors", parentId: "id"}},
        {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
        {kind: "XV.HoldTypePicker", attr: "deferredParentStatus",
          label: "_nextHoldType".loc()},
        {kind: "XV.DependenciesWidget",
          attr: {workflow: "parent.workflow", successors: "deferredSuccessors", parentId: "id"}},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.SalesOrderWorkflowEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.InputWidget", attr: "name"},
        {kind: "XV.InputWidget", attr: "description"},
        {kind: "XV.WorkflowStatusPicker", attr: "status"},
        {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
        {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
        {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
        {kind: "XV.DateWidget", attr: "dueDate"},
        {kind: "XV.DateWidget", attr: "startDate"},
        {kind: "XV.DateWidget", attr: "assignDate"},
        {kind: "XV.DateWidget", attr: "completeDate"},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {kind: "XV.UserAccountWidget", attr: "owner"},
        {kind: "XV.UserAccountWidget", attr: "assignedTo"},
        {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
        {kind: "XV.SalesOrderStatusPicker", attr: "completedParentStatus",
          noneText: "_noChange".loc(), label: "_nextStatus".loc()},
        {kind: "XV.DependenciesWidget",
          attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
        {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
        {kind: "XV.SalesOrderStatusPicker", attr: "deferredParentStatus",
          noneText: "_noChange".loc(), label: "_nextStatus".loc()},
        {kind: "XV.DependenciesWidget",
          attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
        {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
        {kind: "XV.TextArea", attr: "notes", fit: true}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.SaleTypeWorkflowBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_workflow".loc(),
    editor: "XV.SaleTypeWorkflowEditor",
    parentKey: "saleType",
    listRelations: "XV.SaleTypeWorkflowListRelations",
    fitButtons: false
  });

  enyo.kind({
    name: "XV.SalesOrderWorkflowBox",
    kind: "XV.ListRelationsEditorBox",
    title: "_workflow".loc(),
    editor: "XV.SalesOrderWorkflowEditor",
    parentKey: "salesOrder",
    listRelations: "XV.SalesOrderWorkflowListRelations",
    fitButtons: false
  });
}());
