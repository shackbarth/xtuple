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
              {kind: "XV.ListAttr", attr: "quantity"},
              {kind: "XV.ListAttr", attr: "vendorUnit"}
            ]}
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
