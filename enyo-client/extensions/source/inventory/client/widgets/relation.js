/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XM:true, enyo:true */

(function () {

  // ..........................................................
  // SALES ORDER
  //

  enyo.kind({
    name: "XV.OpenSalesOrderWidget",
    kind: "XV.SalesOrderWidget",
    query: {parameters: [
      {attribute: "status", value: XM.SalesOrderBase.OPEN_STATUS}
    ]}
  });

  enyo.kind({
    name: "XV.ShipmentSalesOrderWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShipmentSalesOrderCollection",
    keyAttribute: "number",
    list: "XV.SalesOrderList",
    nameAttribute: "billtoName",
    descripAttribute: "formatShipto",
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", name: "decorator",
          classes: "xv-input-decorator", components: [
          {name: 'input', kind: "onyx.Input", classes: "xv-subinput",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
            onfocus: "receiveFocus"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", src: "/assets/triangle-down-large.png",
              classes: "xv-relationwidget-icon"},
            {name: 'popupMenu', floating: true, kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: 'searchItem', content: "_search".loc()},
              {kind: "XV.MenuItem", name: 'openItem', content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: 'newItem', content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
        ]}
      ]},
      {kind: "FittableColumns", components: [
        {name: "labels", classes: "xv-relationwidget-column left",
          components: [
          {name: "nameLabel", content: "_billto".loc() + ":",
            classes: "xv-relationwidget-description label"},
          {name: "descriptionLabel", content: "_shipto".loc() + ":",
            classes: "xv-relationwidget-description label"}
        ]},
        {name: "data", fit: true, components: [
          {name: "name", classes: "xv-relationwidget-description hasLabel"},
          {name: "description", classes: "xv-relationwidget-description hasLabel",
            allowHtml: true}
        ]}
      ]}
    ]
  });


  // ..........................................................
  // SHIPMENT
  //

  enyo.kind({
    name: "XV.ShipmentWidget",
    kind: "XV.RelationWidget",
    collection: "XM.ShipmentRelationCollection",
    keyAttribute: "number",
    list: "XV.ShipmentList"
  });

}());