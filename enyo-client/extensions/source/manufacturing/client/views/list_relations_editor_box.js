/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  XT.extensions.manufacturing.initListRelationsEditorBox = function () {

    // ..........................................................
    // POST PRODUCTION CREATE LOT/SERIAL/SELECT LOCATION
    //

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantity"},
          {kind: "XV.TraceCombobox", attr: "lotSerial"},
          {kind: "XV.LocationPicker", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"},
          {kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_lotSerial".loc(),
      editor: "XV.PostProductionCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.PostProductionCreateLotSerialListRelations"
    });

  };

}());
