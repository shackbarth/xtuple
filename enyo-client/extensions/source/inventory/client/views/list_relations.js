/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {


  XT.extensions.inventory.initListRelations = function () {

    // ..........................................................
    // ISSUE TO SHIPPING DETAIL
    //

    enyo.kind({
      name: "XV.IssueToShippingDetailListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "aisle"},
        {attribute: "rack"},
        {attribute: "bin"},
        {attribute: "location"}
      ],
      parentKey: "itemSite",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "location", formatter: "formatLocation"},
                {kind: "XV.ListAttr", attr: "quantity", formatter: "formatQuantity",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "selected", formatter: "formatQuantity",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatLocation: function (value, view, model) {
        if (value) { return value.format(); }
      },
      formatQuantity: function (value, view, model) {
        var scale = XT.session.locale.attributes.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

    // ..........................................................
    // SHIPMENT LINE
    //

    enyo.kind({
      name: "XV.ShipmentLineListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "issued"}
      ],
      parentKey: "shipment",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderLine.lineNumber", classes: "bold"},
                {kind: "XV.ListAttr", attr: "orderLine.site.code",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "orderLine.item.number", fit: true}
              ]},
              {kind: "XV.ListAttr", attr: "orderLine.item.description1",
                fit: true,  style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "orderLine.quantity",
                formatter: "formatQuantity", style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "orderLine.shipped",
                formatter: "formatQuantity", style: "text-align: right", classes: "bold"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "orderLine.quantityUnit.name"},
              {kind: "XV.ListAttr", attr: "orderLine.quantityUnit.name"}
            ]}
          ]}
        ]}
      ],

      formatQuantity: function (value, view, model) {
        var scale = XT.session.locale.attributes.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

  };

}());
