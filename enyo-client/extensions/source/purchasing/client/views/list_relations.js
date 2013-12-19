/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.purchasing.initListRelations = function () {

    // ..........................................................
    // PURCHASE ORDER
    //

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "purchaseOrder"
    });

    // ..........................................................
    // PURCHASE ORDER LINE
    //

    enyo.kind({
      name: "XV.PurchaseOrderLineListRelations",
      kind: "XV.ListRelations",
      parentKey: "purchaseOrder",
      orderBy: [
        {attribute: "lineNumber"}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "FittableColumns", components: [
                  {kind: "XV.ListAttr", attr: "lineNumber", isKey: true}
                ]}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.number"},
                {kind: "XV.ListAttr", attr: "item.description1"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "quantity", formatter: "formatQuantity"},
              {kind: "XV.ListAttr", attr: "vendorUnit"}
            ]}
          ]}
        ]}
      ],
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeWorkflowListRelations",
      kind: "XV.WorkflowListRelations",
      parentKey: "purchaseType"
    });

  };

}());
