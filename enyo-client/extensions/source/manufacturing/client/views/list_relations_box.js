/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, strict: false,
trailing:true, white:true*/
/*global  enyo:true, XT: true */

(function () {

  XT.extensions.manufacturing.initListRelationsBox = function () {

    // ..........................................................
    // ISSUE MATERIAL LOCATIONS
    //

    enyo.kind({
      name: "XV.IssueMaterialDetailRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_detail".loc(),
      parentKey: "itemSite",
      listRelations: "XV.IssueStockDetailListRelations",
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
      }
    });

    // ..........................................................
    // POST LINE
    //

    enyo.kind({
      name: "XV.WorkOrderMaterialRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_lineItems".loc(),
      parentKey: "workOrder",
      listRelations: "XV.WorkOrderMaterialLineListRelations",
      canOpen: false
    });

  };

}());
