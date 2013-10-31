/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.manufacturing.initListRelations = function () {

    // ..........................................................
    // POST PRODUCTION CREATE LOT SERIAL / DISTRIBUTE TO LOCATIONS
    //

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "quantity"}
      ],
      parentKey: "itemSite",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "quantity", classes: "bold"},
                {kind: "XV.ListAttr", attr: "trace", fit: true},
                {kind: "XV.ListAttr", attr: "expireDate"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "location", fit: true, style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "warrantyDate", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // WORK ORDER MATERIAL LINE
    //

    enyo.kind({
      name: "XV.WorkOrderMaterialLineListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: "lineNumber"}
      ],
      parentKey: "shipment",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderLine.lineNumber", classes: "bold"},
                {kind: "XV.ListAttr", attr: "orderLine.item.number", fit: true},
                {kind: "XV.ListAttr", attr: "orderLine.quantity", classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "orderLine.item.description1",
                  fit: true,  style: "text-indent: 18px;"},
                {kind: "XV.ListAttr", attr: "orderLine.quantityUnit.name",
                  classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

  };

}());
