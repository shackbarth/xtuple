/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.purchasing.initGridBox = function () {

    // ..........................................................
    // PURCHASE ORDER
    //

    enyo.kind({
      name: "XV.PurchaseOrderLineRow",
      kind: "XV.GridRow",
      formatDescription: function (value, view, model) {
        var item = model.get("item"),
          expenseCategory = model.get("expenseCategory");
        if (item) {
          return item.get("description1");
        } else if (expenseCategory) {
          return expenseCategory.get("description");
        }
        return "";
      },
      formatNumber: function (value, view, model) {
        var item = model.get("item"),
          expenseCategory = model.get("expenseCategory");
        if (item) {
          return item.get("number");
        } else if (expenseCategory) {
          return expenseCategory.get("code");
        }
        return "";
      },
      formatSite: function (value, view, model) {
        var site = model.get("site"),
          expenseCategory = model.get("expenseCategory");
        if (site) {
          return site.get("code");
        } else if (expenseCategory) {
          return "(" + "_miscellaneous".loc() + ")";
        }
        return "";
      }
    });

    enyo.kind({
      name: "XV.PurchaseOrderLineGridBox",
      kind: "XV.GridBox",
      classes: "large-panel",
      title: "_lineItems".loc(),
      gridRowKind: "XV.PurchaseOrderLineRow",
      workspace: "XV.PurchaseOrderLineWorkspace",
      summary: "XV.PurchaseOrderSummaryPanel",
      parentKey: "purchaseOrder",
      columns: [
        {classes: "line-number", header: "#", rows: [
          {readOnlyAttr: "lineNumber",
            editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
        ]},
        {classes: "grid-item", header: "_item".loc(), rows: [
          {formatter: "formatNumber",
            editor: {kind: "XV.ItemSiteWidget", attr:
            {item: "item", site: "site"},
            name: "itemSiteWidget",
            query: {parameters: [
            {attribute: "isPurchased", value: true},
            {attribute: "isActive", value: true}
          ]}}},
          {formatter: "formatDescription"},
          {formatter: "formatSite"}
        ]},
        {classes: "quantity", header: "_quantity".loc(), rows: [
          {readOnlyAttr: "quantity",
            editor: {kind: "XV.QuantityWidget", attr: "quantity",
              name: "quantityWidget"}},
          {readOnlyAttr: "vendorUnit",
            editor: {kind: "XV.InputWidget", attr: "vendorUnit"}},
          {readOnlyAttr: "getPurchaseOrderStatusString",
            editor: {kind: "XV.PurchaseOrderStatusPicker", attr: "status"}}
        ]},
        {classes: "price", header: "_price".loc(), rows: [
          {readOnlyAttr: "price",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "price", currency: "currency"},
              currencyDisabled: true, currencyShowing: false,
              scale: XT.PURCHASE_PRICE_SCALE}},
          {readOnlyAttr: "extendedPrice",
            editor: {kind: "XV.MoneyWidget",
              attr: {localValue: "extendedPrice", currency: "currency"},
              currencyDisabled: true, currencyShowing: false,
              scale: XT.EXTENDED_PRICE_SCALE}}
        ]},
        {classes: "date", header: "_dueDate".loc(), rows: [
          {readOnlyAttr: "dueDate",
            editor: {kind: "XV.DateWidget", attr: "dueDate"}}
        ]},
        {classes: "date", header: ["_vendorItem".loc(), "_manufacturerItem".loc()], rows: [
          {readOnlyAttr: "vendorItemNumber",
            editor: {kind: "XV.InputWidget", attr: "vendorItemNumber"}},
          {readOnlyAttr: "manufacturerItemNumber",
            editor: {kind: "XV.InputWidget", attr: "manufacturerItemNumber"}},
        ]},
        {classes: "quantity", header: ["_received".loc(), "_vouchered".loc()], rows: [
          {readOnlyAttr: "received",
            editor: {kind: "XV.QuantityWidget", attr: "received",
              name: "shippedWidget"}},
          {readOnlyAttr: "vouchered",
            editor: {kind: "XV.QuantityWidget", attr: "vouchered"}},
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.PurchaseOrderWorkflowWorkspace"
    });

  };

}());
