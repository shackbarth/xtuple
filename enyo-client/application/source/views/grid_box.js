/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // INVOICE
  //

  enyo.kind({
    name: "XV.InvoiceLineItemGridBox",
    kind: "XV.GridBox",
    classes: "medium-panel",
    title: "_lineItems".loc(),
    columns: [
      {classes: "line-number", header: "#", rows: [
        {readOnlyAttr: "lineNumber",
          editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
      ]},
      {classes: "grid-item", header: ["_item".loc(), "_site".loc()], rows: [
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
      {classes: "quantity", header: ["_ordered".loc(), "_billed".loc()], rows: [
        {readOnlyAttr: "quantity",
          editor: {kind: "XV.QuantityWidget", attr: "quantity",
            name: "quantityWidget"}},
        {readOnlyAttr: "billed",
          editor: {kind: "XV.QuantityWidget", attr: "billed", placeholder: "_billed".loc(),
            name: "billedWidget"}},
        {readOnlyAttr: "quantityUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "quantityUnit",
            name: "quantityUnitPicker", tabStop: false }}
      ]},
      {classes: "price", header: ["_price".loc(), "_extendedPrice".loc()], rows: [
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
      ]}
    ],
    //editorMixin: salesOrderGridRow,
    summary: "XV.SalesSummaryPanel",
    workspace: "XV.InvoiceLineWorkspace",
    parentKey: "invoice"
  });

  // ..........................................................
  // SALES ORDER / QUOTE
  //

  var salesOrderGridRow = {};
  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    classes: "medium-panel",
    title: "_lineItems".loc(),
    columns: [
      {classes: "line-number", header: "#", rows: [
        {readOnlyAttr: "lineNumber",
          editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
      ]},
      {classes: "grid-item", header: "_item".loc(), rows: [
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
      {classes: "quantity", header: "_quantity".loc(), rows: [
        {readOnlyAttr: "quantity",
          editor: {kind: "XV.QuantityWidget", attr: "quantity",
            name: "quantityWidget"}},
        {readOnlyAttr: "quantityUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "quantityUnit",
            name: "quantityUnitPicker", tabStop: false }}
      ]},
      {classes: "percent", header: "_discount".loc(), rows: [
        {readOnlyAttr: "discount",
          editor: {kind: "XV.PercentWidget", name: "discount",
            attr: "discount" }}
      ]},
      {classes: "price", header: "_price".loc(), rows: [
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
      {classes: "date", header: "_scheduled".loc(), rows: [
        {readOnlyAttr: "scheduleDate",
          editor: {kind: "XV.DateWidget", attr: "scheduleDate"}}
      ]}
    ],
    editorMixin: salesOrderGridRow,
    summary: "XV.SalesSummaryPanel",
    workspace: "XV.SalesOrderLineWorkspace",
    parentKey: "salesOrder"
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
