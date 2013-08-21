/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT: true */

(function () {

  XT.extensions.inventory.initListRelationsBox = function () {

    // ..........................................................
    // ISSUE TO SHIPPING LOCATIONS
    //

    enyo.kind({
      name: "XV.IssueToShippingDetailRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_detail".loc(),
      parentKey: "itemSite",
      listRelations: "XV.IssueToShippingDetailListRelations",
      canOpen: false,
      events: {
        onDetailSelectionChanged: ""
      },
      selectionChanged: function (inSender, inEvent) {
        var index = inEvent.index;
        this.doDetailSelectionChanged({
          index: index,
          model: this.$.list.readyModels()[index],
          isSelected: inEvent.originator.isSelected(index)
        });
        this.$.list.renderRow(inEvent.key);
      }
    });

    // ..........................................................
    // SHIPMENT LINE
    //

    enyo.kind({
      name: "XV.ShipmentLineRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_lineItems".loc(),
      parentKey: "shipment",
      listRelations: "XV.ShipmentLineListRelations",
      canOpen: false
    });

  };

}());
