/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true*/

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
      multiSelect: true,
      parentKey: "itemSite",
      events: {
        onDistributedTapped: ""
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "FittableColumns", components: [
                  {kind: "XV.ListAttr", attr: "location",
                    formatter: "formatLocation"},
                ]},
                {kind: "XV.ListAttr", attr: "quantity",
                  formatter: "formatQuantity",
                  classes: "right"},
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "location.description",
                  formatter: "formatDefault"},
                {kind: "XV.ListAttr", attr: "distributed",
                  classes: "right hyperlink", ontap: "distributedTapped"}
              ]}
            ]}
          ]}
        ]}
      ],
      distributedTapped: function (inSender, inEvent) {
        inEvent.model = this.readyModels()[inEvent.index];
        this.doDistributedTapped(inEvent);
        return true;
      },
      isDefault: function (model) {
        var location = model.get("location"),
          itemSite = model.get("itemSite"),
          stockLoc = itemSite.get("stockLocation");
        return stockLoc.id === location.id;
      },
      formatDefault: function (value, view, model) {
        view.addRemoveClass("emphasis", this.isDefault(model));
        return value;
      },
      formatLocation: function (value, view, model) {
        view.addRemoveClass("emphasis", this.isDefault(model));
        if (value) { return value.format(); }
      },
      formatQuantity: function (value, view, model) {
        var scale = XT.session.locale.attributes.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      /**
        Overload: Don't highlight as selected if no quantity was distributed.
      */
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var view = this.$.listItem,
          model = this.readyModels()[inEvent.index],
          isDistributed = model.get("distributed");
        view.addRemoveClass("item-selected", isDistributed);
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
