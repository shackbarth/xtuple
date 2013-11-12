/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global XT:true, enyo:true, Globalize:true, _:true*/

(function () {


  XT.extensions.inventory.initListRelations = function () {

    // ..........................................................
    // ISSUE STOCK DETAIL
    //

    enyo.kind({
      name: "XV.IssueStockDetailListRelations",
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
                {content: ""},
                {kind: "XV.ListAttr", attr: "distributed",
                  formatter: "formatQuantity",
                  classes: "right hyperlink", ontap: "distributedTapped"}
              ]}
            ]}
          ]}
        ]}
      ],
      destroy: function () {
        var collection = this.getValue(),
          that = this;
        _.each(collection.models, function (model) {
          model.off("change:distributed", that.rowChanged, that);
        });
        this.inherited(arguments);
      },
      distributedTapped: function (inSender, inEvent) {
        inEvent.model = this.readyModels()[inEvent.index];
        this.doDistributedTapped(inEvent);
        return true;
      },
      isDefault: function (model) {
        var location = model.get("location"),
          itemSite = model.get("itemSite"),
          stockLoc = itemSite.get("stockLocation");
        return location && stockLoc.id === location.id;
      },
      formatLocation: function (value, view, model) {
        view.addRemoveClass("emphasis", this.isDefault(model));
        if (value) { return value.format(); }
      },
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      rowChanged: function (model) {
        this.renderRow(this.getValue().indexOf(model));
      },
      /**
        Overload: Don't highlight as selected if no quantity was distributed.
      */
      setupItem: function (inSender, inEvent) {
        var view = this.$.listItem,
          model = this.readyModels()[inEvent.index],
          isDistributed;
        if (!model) { return; } // Hack
        this.inherited(arguments);
        isDistributed = model.get("distributed");
        view.addRemoveClass("item-selected", isDistributed);
      },
      /**
       Overload: Add observers to all detail models to re-render if
       distribute values change.
       */
      valueChanged: function () {
        this.inherited(arguments);
        var that = this,
         collection = this.getValue();
        _.each(collection.models, function (model) {
          model.on("change:distributed", that.rowChanged, that);
        });
      }
    });

    // ..........................................................
    // SHIPMENT LINE
    //

    enyo.kind({
      name: "XV.ShipmentLineListRelations",
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
                {kind: "XV.ListAttr", attr: "orderLine.quantity",
                  formatter: "formatQuantity", classes: "right"},
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
      ],
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      }
    });

  };

}());
