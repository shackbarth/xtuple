/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.purchasing.initLists = function () {

    // ..........................................................
    // PURCHASE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.PurchaseEmailProfileList",
      kind: "XV.PurchaseProfileList",
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
      query: {orderBy: [
        {attribute: 'number'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "getPurchaseOrderStatusString",
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
              {kind: "XV.ListAttr", formatter: "site.code"},
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
