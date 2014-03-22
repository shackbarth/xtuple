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
      editorMixin: XV.PurchaseOrderLineMixin,
      workspace: "XV.PurchaseOrderLineWorkspace",
      summary: "XV.PurchaseOrderSummaryPanel",
      parentKey: "purchaseOrder",
      orderBy: [{attribute: "lineNumber"}],
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
            {attribute: "isActive", value: true}
          ]}}},
          {formatter: "formatDescription"},
          {formatter: "formatSite"}
        ]},
        {classes: "quantity", header: ["_quantity".loc(), "_unit".loc(), "_dueDate".loc()], rows: [
          {readOnlyAttr: "quantity",
            editor: {kind: "XV.QuantityWidget", attr: "quantity",
              name: "quantityWidget"}},
          {readOnlyAttr: "vendorUnit",
            placeholder: "_na".loc(),
            editor: {kind: "XV.InputWidget", attr: "vendorUnit"}},
          {readOnlyAttr: "dueDate",
            editor: {kind: "XV.DateWidget", attr: "dueDate"}}
        ]},
        {classes: "price", header: ["_price".loc(), "_extended".loc()], rows: [
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
        {classes: "grid-item",
          header: ["_vendorItem".loc(), "_manufacturerItem".loc(), "_project".loc()],
          rows: [
          {readOnlyAttr: "vendorItemNumber",
            placeholder: "_noVendorNumber".loc(),
            editor: {kind: "XV.ItemSourceWidget", showDetail: false,
            attr: {itemSource: "itemSource", vendorItemNumber: "vendorItemNumber"}}},
          {readOnlyAttr: "manufacturerItemNumber",
            placeholder: "_noManufacturerNumber".loc(),
            editor: {kind: "XV.InputWidget", attr: "manufacturerItemNumber"}},
          {readOnlyAttr: "project.number",
            placeholder: "_noProject".loc(),
            editor: {kind: "XV.ProjectWidget", attr: "project"}}
        ]},
        {classes: "date", header: ["_received".loc(), "_vouchered".loc(), "_status".loc()], rows: [
          {readOnlyAttr: "received",
            editor: {kind: "XV.QuantityWidget", attr: "received",
              name: "shippedWidget"}},
          {readOnlyAttr: "vouchered",
            editor: {kind: "XV.QuantityWidget", attr: "vouchered",
              name: "voucheredWidget"}},
          {readOnlyAttr: "formatStatus",
            editor: {kind: "XV.PurchaseOrderStatusPicker", attr: "status"}}
        ]},
      ]
    });

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.PurchaseOrderWorkflowWorkspace"
    });

  };

}());
