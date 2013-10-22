/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectTaskHeaders",
    classes: "xv-grid-row",
    components: [
      {classes: "xv-grid-header grid-item", content: "_number".loc() },
      {classes: "xv-grid-header user", content: "_user".loc()},
      {classes: "xv-grid-header quantity", content: "_hours".loc()},
      {classes: "xv-grid-header price", content: "_expenses".loc()},
      {classes: "xv-grid-header date", content: "_scheduled".loc()},
      {classes: "xv-grid-header date", content: "_actualDate".loc()}
    ]
  });

  enyo.kind({
    name: "XV.ProjectTaskReadOnlyGridRow",
    kind: "XV.ReadOnlyGridRow",
    components: [
      {classes: "xv-grid-column grid-item", components: [
        {name: "number"},
        {name: "name"}
      ]},
      {classes: "xv-grid-column user", components: [
        {name: "owner"},
        {name: "assignedTo"},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {name: "budgetedHours"},
        {name: "actualHours"},
      ]},
      {classes: "xv-grid-column price", components: [
        {name: "budgetedExpenses"},
        {name: "actualExpenses"}
      ]},
      {classes: "xv-grid-column date", components: [
        {name: "startDate"},
        {name: "dueDate"}
      ]},
      {classes: "xv-grid-column date", components: [
        {name: "assignDate"},
        {name: "completeDate"}
      ]}
    ],
    valueChanged: function () {
      var model = this.getValue();

      if (model) {
        this.$.number.setContent(model.get("number") || "_required".loc());
        this.$.name.setContent(model.get("name") || "_required".loc());
        this.$.owner.setContent(model.getValue("owner.username") || "");
        this.$.assignedTo.setContent(model.getValue("assignedTo.username") || "");
        this.$.budgetedHours.setContent(this.formatQuantity(model.get("budgetedHours")));
        this.$.actualHours.setContent(this.formatQuantity(model.get("actualHours")));
        this.$.budgetedExpenses.setContent(this.formatMoney(model.get("budgetedExpenses")));
        this.$.actualExpenses.setContent(this.formatMoney(model.get("actualExpenses")));
        this.$.startDate.setContent(this.formatDate(model.get("startDate")));
        this.$.dueDate.setContent(this.formatDate(model.get("dueDate")));
        this.$.assignDate.setContent(this.formatDate(model.get("assignDate")));
        this.$.completeDate.setContent(this.formatDate(model.get("completeDate")));
      }
    }
  });

  enyo.kind({
    name: "XV.ProjectTaskGridRow",
    kind: "XV.GridRow",
    components: [
      // each field is grouped with its column header so that the alignment always
      // works out. All but the first column header will be invisible.
      {classes: "xv-grid-column grid-item", components: [
        {kind: "XV.InputWidget", attr: "number"},
        {kind: "XV.InputWidget", attr: "name"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {kind: "XV.UserAccountWidget", attr: "owner"},
        {kind: "XV.UserAccountWidget", attr: "assignedTo"}
      ]},
      {classes: "xv-grid-column quantity", components: [
        {kind: "XV.QuantityWidget", attr: "budgetedHours"},
        {kind: "XV.QuantityWidget", attr: "actualHours"}
      ]},
      {classes: "xv-grid-column price", components: [
        {kind: "XV.MoneyWidget", attr:
          {localValue: "budgetedExpenses", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.MONEY_SCALE},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "actualExpenses", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.MONEY_SCALE}
      ]},
      {classes: "xv-grid-column date", components: [
        {kind: "XV.DateWidget", attr: "startDate"},
        {kind: "XV.DateWidget", attr: "dueDate"}
      ]},
      {classes: "xv-grid-column date", components: [
        {kind: "XV.DateWidget", attr: "assignDate"},
        {kind: "XV.DateWidget", attr: "completeDate"}
      ]},
      {classes: "xv-grid-column grid-actions", components: [
        {components: [
          {kind: "enyo.Button",
            classes: "icon-plus xv-gridbox-button",
            name: "addGridRowButton",
            onkeyup: "addButtonKeyup" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-search xv-gridbox-button",
            name: "expandGridRowButton" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-remove-sign xv-gridbox-button",
            name: "deleteGridRowButton" }
        ]}
      ]}
    ]
  });

  enyo.kind({
    name: "XV.ProjectTasksGridBox",
    kind: "XV.GridBox",
    associatedWorkspace: "XV.ProjectTaskWorkspace",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc(),
        classes: "xv-grid-groupbox-header"},
      {kind: "XV.ProjectTaskHeaders"},
      {kind: "XV.Scroller", name: "mainGroup", horizontal: "hidden", fit: true, components: [
        {kind: "List", name: "aboveGridList", classes: "xv-above-grid-list",
            onSetupItem: "setupRowAbove", ontap: "gridRowTapAbove", components: [
          { kind: "XV.ProjectTaskReadOnlyGridRow", name: "aboveGridRow"}
        ]},
        {kind: "XV.ProjectTaskGridRow", name: "editableGridRow", showing: false},
        {kind: "List", name: "belowGridList", classes: "xv-below-grid-list",
            onSetupItem: "setupRowBelow", ontap: "gridRowTapBelow", components: [
          {kind: "XV.ProjectTaskReadOnlyGridRow", name: "belowGridRow"}
        ]},
      ]},
      {
        kind: "FittableColumns",
        name: "navigationButtonPanel",
        classes: "xv-groupbox-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
            content: "_new".loc(), classes: "xv-groupbox-button-single"}
        ]
      }
    ]
  });

  // ..........................................................
  // SALES ORDER / QUOTE
  //

  enyo.kind({
    name: "XV.SalesOrderLineItemHeaders",
    classes: "xv-grid-row",
    components: [
      {classes: "xv-grid-header line-number", content: "#" },
      {classes: "xv-grid-header grid-item", content: "_item".loc()},
      {classes: "xv-grid-header quantity", content: "_quantity".loc()},
      {classes: "xv-grid-header discount", content: "_discount".loc()},
      {classes: "xv-grid-header price", content: "_price".loc()},
      {classes: "xv-grid-header date", content: "_scheduled".loc()}
    ]
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemReadOnlyGridRow",
    kind: "XV.ReadOnlyGridRow",
    components: [
      {kind: "XV.ReadOnlyGridColumn",
        classes: "line-number", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "lineNumber"}
      ]},
      {kind: "XV.ReadOnlyGridColumn",
        classes: "grid-item", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "item.number"},
        {kind: "XV.ReadOnlyGridAttr", attr: "item.description1"},
        {kind: "XV.ReadOnlyGridAttr", attr: "site.code"},
      ]},
      {kind: "XV.ReadOnlyGridColumn",
        classes: "quantity", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "quantity"},
        {kind: "XV.ReadOnlyGridAttr", attr: "quantityUnit.name"}
      ]},
      {kind: "XV.ReadOnlyGridColumn",
        classes: "discount", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "discount"}
      ]},
      {kind: "XV.ReadOnlyGridColumn",
        classes: "price", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "price"},
        {kind: "XV.ReadOnlyGridAttr", attr: "priceUnit.name"},
        {kind: "XV.ReadOnlyGridAttr", attr: "extendedPrice"}
      ]},
      {kind: "XV.ReadOnlyGridColumn",
        classes: "date", components: [
        {kind: "XV.ReadOnlyGridAttr", attr: "scheduleDate"}
      ]}
    ]
  });

  //
  // The implementation of GridRow and GridBox is here in the workspace kind.
  // We could move them to a grid_box.js if we want. It is currently the only
  // implementation of GridRow and GridBox. Once we have a second, we'll probably
  // want to generalize this code and move it to enyo-x.
  //
  var salesOrderGridRow = {
    name: "XV.SalesOrderLineItemGridRow",
    kind: "XV.GridRow",
    components: [
      // each field is grouped with its column header so that the alignment always
      // works out. All but the first column header will be invisible.
      {classes: "xv-grid-column line-number", components: [
        // Using XV.NumberWidget instead of XV.Number here (and elsewhere) because
        // of the pretty rounded corners, even though we have to hide the label with css
        {kind: "XV.NumberWidget", attr: "lineNumber"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {kind: "XV.QuantityWidget", attr: "quantity", name: "quantityWidget"},
        {kind: "XV.UnitCombobox", attr: "quantityUnit", name: "quantityUnitPicker",
          tabStop: false }
      ]},
      {classes: "xv-grid-column discount", components: [
        {kind: "XV.PercentWidget", name: "discount", attr: "discount" }
      ]},
      {classes: "xv-grid-column price", components: [
        {kind: "XV.MoneyWidget", attr:
          {localValue: "price", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.SALES_PRICE_SCALE},
        {kind: "XV.UnitCombobox", attr: "priceUnit", name: "priceUnitPicker",
          tabStop: false},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "extendedPrice", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.EXTENDED_PRICE_SCALE}
      ]},
      {classes: "xv-grid-column date", components: [
        {kind: "XV.DateWidget", attr: "scheduleDate"}
      ]},
      {classes: "xv-grid-column grid-actions", components: [
        {components: [
          {kind: "enyo.Button",
            classes: "icon-plus xv-gridbox-button",
            name: "addGridRowButton",
            onkeyup: "addButtonKeyup" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-search xv-gridbox-button",
            name: "expandGridRowButton" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"},
            classes: "icon-remove-sign xv-gridbox-button",
            name: "deleteGridRowButton" }
        ]}
      ]}
    ]
  };

  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);
  enyo.kind(salesOrderGridRow);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    title: "_lineItems".loc(),
    header: "XV.SalesOrderLineItemHeaders",
    readOnlyRow: "XV.SalesOrderLineItemReadOnlyGridRow",
    editableRow: "XV.SalesOrderLineItemGridRow",
    summary: "SalesSummaryPanel",
    associatedWorkspace: "XV.SalesOrderLineWorkspace",

    /**
      Set the current model into Summary Panel.
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.salesOrder || this.value.quote;
      this.$.summaryPanel.setValue(model);
    },

    gridRowTapEither: function (index, indexStart) {
      this.inherited(arguments);

      // focus on the first editable widget
      var row = this.$.editableGridRow.$;
      if (row.itemSiteWidget.getDisabled()) {
        row.quantityWidget.focus();
      } else {
        row.itemSiteWidget.focus();
      }
    },
  });

  enyo.kind({
    name: "XV.QuoteLineItemGridBox",
    kind: "XV.SalesOrderLineItemGridBox",
    associatedWorkspace: "XV.QuoteLineWorkspace"
  });

}());
