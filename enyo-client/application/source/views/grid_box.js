/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // PROJECT
  //

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
    title: "_tasks".loc(),
    columns: [
      {classes: "grid-item", content: "_number".loc(),
        attrs: ["number", "name"]},
      {classes: "user", content: "_user".loc(),
        attrs: ["owner.username", "assignedTo.username"]},
      {classes: "quantity", content: "_hours".loc(),
        attrs: ["budgetedHours", "actualHours"]},
      {classes: "price", content: "_expenses".loc(),
        attrs: ["budgetedExpenses", "actualExpenses"]},
      {classes: "date", content: "_scheduled".loc(),
        attrs: ["startDate", "dueDate"]},
      {classes: "date", content: "_actualDate".loc(),
        attrs: ["assignDate", "completeDate"]}
    ],
    editableRow: "XV.ProjectTaskGridRow",
    associatedWorkspace: "XV.ProjectTaskWorkspace"
  });

  // ..........................................................
  // SALES ORDER / QUOTE
  //

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
    columns: [
      {classes: "line-number", content: "#",
        attrs: ["lineNumber"]},
      {classes: "grid-item", content: "_item".loc(),
        attrs: ["item.number", "item.description1", "site.code"]},
      {classes: "quantity", content: "_quantity".loc(),
        attrs: ["quantity", "quantityUnit.name"]},
      {classes: "discount", content: "_discount".loc(),
        attrs: ["discount"]},
      {classes: "price", content: "_price".loc(),
        attrs: ["price", "priceUnit.name", "extendedPrice"]},
      {classes: "date", content: "_scheduled".loc(),
        attrs: ["scheduleDate"]}
    ],
    editableRow: "XV.SalesOrderLineItemGridRow",
    summary: "SalesSummaryPanel",
    associatedWorkspace: "XV.SalesOrderLineWorkspace",
    parentKey: "salesOrder",

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
    associatedWorkspace: "XV.QuoteLineWorkspace",
    parentKey: "quote"
  });

}());
