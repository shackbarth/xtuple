/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectTasksGridBox",
    kind: "XV.GridBox",
    title: "_tasks".loc(),
    columns: [
      {classes: "grid-item", content: "_number".loc(), rows: [
        {readOnlyAttr: "number",
          editor: {kind: "XV.InputWidget", attr: "number"}},
        {readOnlyAttr: "name",
          editor: {kind: "XV.InputWidget", attr: "name"}}
      ]},
      {classes: "user", content: "_user".loc(), rows: [
        {readOnlyAttr: "owner.username",
          editor: {kind: "XV.UserAccountWidget", attr: "owner"}},
        {readOnlyAttr: "assignedTo.username",
          editor: {kind: "XV.UserAccountWidget", attr: "assignedTo"}},
      ]},
      {classes: "quantity", content: "_hours".loc(), rows: [
        {readOnlyAttr: "budgetedHours",
          editor: {kind: "XV.QuantityWidget", attr: "budgetedHours"}},
        {readOnlyAttr: "actualHours",
          editor: {kind: "XV.QuantityWidget", attr: "actualHours"}}
      ]},
      {classes: "price", content: "_expenses".loc(), rows: [
        {readOnlyAttr: "budgetedExpenses",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "budgetedExpenses", currency: ""},
            currencyDisabled: true, currencyShowing: false}},
        {readOnlyAttr: "actualExpenses",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "actualExpenses", currency: ""},
            currencyDisabled: true, currencyShowing: false}}
      ]},
      {classes: "date", content: "_scheduled".loc(), rows: [
        {readOnlyAttr: "startDate",
          editor: {kind: "XV.DateWidget", attr: "startDate"}},
        {readOnlyAttr: "dueDate",
          editor: {kind: "XV.DateWidget", attr: "dueDate"}}
      ]},
      {classes: "date", content: "_actualDate".loc(), rows: [
        {readOnlyAttr: "assignDate",
          editor: {kind: "XV.DateWidget", attr: "assignDate"}},
        {readOnlyAttr: "completeDate",
          editor: {kind: "XV.DateWidget", attr: "completeDate"}}
      ]}
    ],
    workspace: "XV.ProjectTaskWorkspace"
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
  var salesOrderGridRow = {};
  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    title: "_lineItems".loc(),
    columns: [
      {classes: "line-number", content: "#", rows: [
        {readOnlyAttr: "lineNumber",
          editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
      ]},
      {classes: "grid-item", content: "_item".loc(), rows: [
        {readOnlyAttr: "item.number",
          editor: {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}}},
        {readOnlyAttr: "item.description1"},
        {readOnlyAttr: "site.code"}
      ]},
      {classes: "quantity", content: "_quantity".loc(), rows: [
        {readOnlyAttr: "quantity",
          editor: {kind: "XV.QuantityWidget", attr: "quantity",
            name: "quantityWidget"}},
        {readOnlyAttr: "quantityUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "quantityUnit",
            name: "quantityUnitPicker", tabStop: false }}
      ]},
      {classes: "discount", content: "_discount".loc(), rows: [
        {readOnlyAttr: "discount",
          editor: {kind: "XV.PercentWidget", name: "discount",
            attr: "discount" }}
      ]},
      {classes: "price", content: "_price".loc(), rows: [
        {readOnlyAttr: "price",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "price", currency: ""},
            currencyDisabled: true, currencyShowing: false,
            scale: XT.SALES_PRICE_SCALE}},
        {readOnlyAttr: "priceUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "priceUnit",
            name: "priceUnitPicker",
            tabStop: false}},
        {readOnlyAttr: "extendedPrice",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "extendedPrice", currency: ""},
            currencyDisabled: true, currencyShowing: false,
            scale: XT.EXTENDED_PRICE_SCALE}}
      ]},
      {classes: "date", content: "_scheduled".loc(),
        rows: ["scheduleDate"],
        editor: {kind: "XV.DateWidget", attr: "scheduleDate"}}
    ],
    editorMixin: salesOrderGridRow,
    summary: "XV.SalesSummaryPanel",
    workspace: "XV.SalesOrderLineWorkspace",
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

  var quoteGridRow = {};
  enyo.mixin(quoteGridRow, XV.LineMixin);
  enyo.mixin(quoteGridRow, XV.QuoteLineMixin);

  enyo.kind({
    name: "XV.QuoteLineItemGridBox",
    kind: "XV.SalesOrderLineItemGridBox",
    workspace: "XV.QuoteLineWorkspace",
    editorMixin: quoteGridRow,
    parentKey: "quote"
  });

}());
