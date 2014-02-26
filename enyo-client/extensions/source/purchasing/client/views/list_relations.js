/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, XM:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.purchasing.initListRelations = function () {

    enyo.kind({
      name: "XV.ItemSourcePriceListRelations",
      kind: "XV.ListRelations",
      parentKey: "itemSource",
      orderBy: [
        {attribute: "quantityBreak"}
      ],
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "quantityBreak"},
                {kind: "XV.ListAttr", formatter: "formatUnit"},
                {kind: "XV.ListAttr", attr: "site.code", classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "priceType", formatter: "formatPriceType"},
                {kind: "XV.ListAttr", formatter: "formatValue"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatPriceType: function (value) {
        return value === XM.ItemSourcePrice.TYPE_NOMINAL ? "_nominal".loc() : "_discount".loc();
      },
      formatUnit: function (value, view, model) {
        return model.getValue("itemSource.vendorUnit");
      },
      formatValue: function (value, view, model) {
        var priceType = model.get("priceType"),
          currency = model.get("currency"),
          discount = model.get("percentDiscount"),
          fixed = model.get("fixedDiscount"),
          wholesale = model.getValue("itemSource.item.wholesalePrice"),
          mscale = XT.locale.purchasePriceScale,
          pscale = XT.locale.percentScale;
        if (priceType === XM.ItemSourcePrice.TYPE_NOMINAL) {
          value = currency.format(model.get("price"), mscale);
        } else {
          if (fixed && discount) {
            value = Globalize.format(discount, "p" + pscale) + " " + currency.format(fixed, mscale);
          } else if (discount) {
            value = Globalize.format(discount, "p" + pscale);
          } else {
            value = currency.format(fixed, mscale);
          }
        }
        return value;
      }
    });

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
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", classes: "bold"},
                {kind: "XV.ListAttr", attr: "item.number", fit: true},
              ]},
              {kind: "XV.ListAttr", attr: "item.description1",
                fit: true,  style: "text-indent: 18px;"},
              {kind: "XV.ListAttr", attr: "site.code",
                style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "quantity",
                style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "vendorUnit",
                style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "dueDate",
                style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "price",
                style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "extendedPrice",
                style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "vendorItemNumber",
                placeholder: "_noVendorNumber".loc()},
              {kind: "XV.ListAttr", attr: "manufacturerItemNumber",
                placeholder: "_noManufacturerNumber".loc()},
              {kind: "XV.ListAttr", attr: "project.number",
                placeholder: "_noProject".loc()}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "received"},
              {kind: "XV.ListAttr", attr: "vouchered"},
              {kind: "XV.ListAttr", attr: "formatStatus"}
            ]},
          ]}
        ]}
      ]

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
