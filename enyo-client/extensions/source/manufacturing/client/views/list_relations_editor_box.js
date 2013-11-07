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
          {kind: "XV.QuantityWidget", attr: "quantity", name: "quantity", content: "qtyRemaining"},
          {kind: "XV.TraceCombobox", attr: "trace"},
          {kind: "XV.LocationPicker", attr: "location"},
          {kind: "XV.DateWidget", attr: "expireDate"},
          {kind: "XV.DateWidget", attr: "warrantyDate"}
          //{kind: "XV.CharacteristicTypePicker", attr: "characteristic"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PostProductionCreateLotSerialBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_lotSerial".loc(),
      editor: "XV.PostProductionCreateLotSerialEditor",
      parentKey: "itemSite",
      listRelations: "XV.PostProductionCreateLotSerialListRelations",
      doneItem: function () {
        this.inherited(arguments);
        if (this.getValue()) {
          var parentModel = this.getParent().getParent().getValue();
          var undistributed = parentModel.undistributed();
          //parentModel.set("undistributed", undistributed);
          if (undistributed > 0) {
            this.newItem();
          }
        }
      },
      transitionFinished: function () {
        this.inherited(arguments);
        if (this.getValue()) {
          //If qty has already been distributed, leave it alone
          if (this.$.editor.$.quantity.getValue() > 0) {
            return this;
          } else {
            //set qty equal to undistributed
            var model = this.parent.parent.getValue(),
              qtyToDistribute = model.get("undistributed");
            this.$.editor.$.quantity.setValue(qtyToDistribute);
          }
          //Call CreateTrace model's method to set readOnly and required
          this.$.editor.getValue().displayAttributes();
        }
      }
    });

  };

}());
