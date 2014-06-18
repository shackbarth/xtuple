/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.purchasing.initLists = function () {

    // ..........................................................
    // ITEM SOURCE
    //

    enyo.kind({
      name: "XV.ItemSourceList",
      kind: "XV.List",
      label: "_itemSources".loc(),
      collection: "XM.ItemSourceCollection",
      query: {orderBy: [
        {attribute: "vendorItemNumber"},
        {attribute: "vendor.name"}
      ]},
      parameterWidget: "XV.ItemSourceListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "name-column", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "vendorItemNumber", isKey: true,
                  placeholder: "_noVendorNumber".loc()}
              ]},
              {kind: "XV.ListAttr", attr: "vendor.name"}
            ]},
            {kind: "XV.ListColumn", classes: "right-column", components: [
              {kind: "XV.ListAttr", attr: "vendorUnit"},
              {kind: "XV.ListAttr", attr: "isDefault",
                formatter: "formatDefault"}
            ]},
            {kind: "XV.ListColumn", classes: "first",
              components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "item.number", classes: "italic"},
                {kind: "XV.ListAttr", attr: "item.inventoryUnit.name", fit: true,
                  classes: "right"}
              ]},
              {kind: "XV.ListAttr", formatter: "formatDescription"}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "effective"},
              {kind: "XV.ListAttr", attr: "expires"}
            ]}
          ]}
        ]}
      ],
      formatDefault: function (value) {
        return value ? "_default".loc() : "";
      },
      formatDescription: function (value, view, model) {
        var item = model.get("item"),
          descrip1 = item.get("description1") || "",
          descrip2 = item.get("description2") || "",
          sep = descrip2 ? " - " : "";
        return descrip1 + sep + descrip2;
      }
    });

    XV.registerModelList("XM.ItemSource", "XV.ItemSourceList");

    // ..........................................................
    // PURCHASE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.PurchaseEmailProfileList",
      kind: "XV.EmailProfileList",
      label: "_purchaseEmailProfiles".loc(),
      collection: "XM.PurchaseEmailProfileCollection"
    });

    // ..........................................................
    // PURCHASE ORDER
    //
    enyo.kind({
      name: "XV.PurchaseOrderList",
      kind: "XV.List",
      label: "_purchaseOrders".loc(),
      collection: "XM.PurchaseOrderListItemCollection",
      parameterWidget: "XV.PurchaseOrderListParameters",
      multiSelect: true,
      actions: [
        {name: "release", privilege: "ReleasePurchaseOrders",
          prerequisite: "canRelease", method: "doRelease",
          notify: false},
        {name: "unrelease", privilege: "ReleasePurchaseOrders",
          prerequisite: "canUnrelease",
          method: "doUnrelease", notify: false},
        {name: "print", privilege: "ViewPurchaseOrders",
          method: "doPrint", isViewMethod: true},
        {name: "email", privilege: "ViewPurchaseOrders",
          method: "doEmail", isViewMethod: true}
      ],
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "formatStatus",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "orderDate",
                  classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "vendor.name"},
                {kind: "XV.ListAttr", attr: "total", formatter: "formatTotal",
                  classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "site.code"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatTotal: function (value, view, model) {
        var currency = model ? model.get("currency") : false,
          scale = XT.locale.moneyScale;
        return currency ? currency.format(value, scale) : "";
      },
      formatShipto: function (value, view, model) {
        var city = model.get("shiptoCity"),
          state = model.get("shiptoState"),
          country = model.get("shiptoCountry");
        return XM.Address.formatShort(city, state, country);
      }
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeList",
      kind: "XV.List",
      label: "_purchaseTypes".loc(),
      collection: "XM.PurchaseTypeCollection",
      query: {orderBy: [
        {attribute: 'code'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });

  };
}());
