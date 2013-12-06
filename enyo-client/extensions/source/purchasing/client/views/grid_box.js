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
      name: "XV.PurchaseOrderLineGridBox",
      kind: "XV.GridBox",
      classes: "large-panel",
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
            {attribute: "item.isPurchased", value: true},
            {attribute: "item.isActive", value: true},
            {attribute: "isActive", value: true}
          ]}}},
          {readOnlyAttr: "item.description1"},
          {readOnlyAttr: "site.code"}
        ]},
        {classes: "quantity", header: "_quantity".loc(), rows: [
          {readOnlyAttr: "quantity",
            editor: {kind: "XV.QuantityWidget", attr: "quantity",
              name: "quantityWidget"}},
          {readOnlyAttr: "unit",
            editor: {kind: "XV.InputWidget", attr: "unit"}}
        ]},
        {classes: "date", header: "_dueDate".loc(), rows: [
          {readOnlyAttr: "dueDate",
            editor: {kind: "XV.DateWidget", attr: "dueDate"}}
        ]},
        {classes: "quantity", header: ["_received".loc(), "_vouchered".loc()], rows: [
          {readOnlyAttr: "received",
            editor: {kind: "XV.QuantityWidget", attr: "shipped",
              name: "shippedWidget"}},
          {readOnlyAttr: "vouchered",
            editor: {kind: "XV.QuantityWidget", attr: "received",
              name: "receivedWidget"}},
        ]}
      ],
      workspace: "XV.PurchaseOrderLineWorkspace"
    });

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowGridBox",
      kind: "XV.WorkflowGridBox",
      workspace: "XV.PurchaseOrderWorkflowWorkspace"
    });

  };

}());
