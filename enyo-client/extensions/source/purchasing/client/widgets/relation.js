/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.purchasing.initRelationWidgets = function () {

    // ..........................................................
    // ITEM SOURCE
    //

    enyo.kind({
      name: "XV.ItemSourceWidget",
      kind: "XV.RelationWidget",
      label: "_itemSource".loc(),
      collection: "XM.ItemSourceCollection",
      list: "XV.ItemSourceList",
      keyAttribute: "vendorItemNumber",
      nameAttribute: "contract.number",
      published: {
        showDetail: true
      },
      components: [
        {kind: "FittableColumns", components: [
          {name: "label", content: "", fit: true, classes: "xv-decorated-label"},
          {kind: "onyx.InputDecorator", name: "decorator",
            classes: "xv-input-decorator", components: [
            {name: "input", kind: "onyx.Input", classes: "xv-subinput",
              onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
              onfocus: "receiveFocus"
            },
            {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
              {kind: "onyx.IconButton", classes: "icon-folder-open-alt"},
              {name: "popupMenu", floating: true, kind: "onyx.Menu",
                components: [
                {kind: "XV.MenuItem", name: "searchItem", content: "_search".loc()},
                {kind: "XV.MenuItem", name: "openItem", content: "_open".loc(),
                  disabled: true},
                {kind: "XV.MenuItem", name: "newItem", content: "_new".loc(),
                  disabled: true}
              ]}
            ]},
            {name: "completer", kind: "XV.Completer", onSelect: "itemSelected"}
          ]}
        ]},
        {kind: "FittableColumns", components: [
          {name: "labels", classes: "xv-relationwidget-column left",
            components: [
            {name: "contractLabel", content: "_contract".loc() + ":",
              classes: "xv-relationwidget-description label",
              showing: false},
            {name: "minimumQtyLabel", content: "_minimumOrderQuantity".loc() + ":",
              classes: "xv-relationwidget-description label",
              showing: false},
            {name: "multipleQtyLabel", content: "_multipleOrderQuantity".loc() + ":",
              classes: "xv-relationwidget-description label",
              showing: false},
            {name: "earliestDateLabel", content: "_earliestDate".loc() + ":",
              classes: "xv-relationwidget-description label",
              showing: false}
          ]},
          {name: "data", fit: true, components: [
            {name: "name", classes: "xv-relationwidget-description hasLabel",
              showing: false},
            {name: "description", classes: "xv-relationwidget-description hasLabel",
              showing: false},
            {name: "minimumQty", classes: "xv-relationwidget-description hasLabel",
              showing: false},
            {name: "multipleQty", classes: "xv-relationwidget-description hasLabel",
              showing: false},
            {name: "earliestDate", classes: "xv-relationwidget-description hasLabel",
              showing: false}
          ]}
        ]}
      ],
      disabledChanged: function () {
        this.inherited(arguments);
        var disabled = this.getDisabled();
        this.$.minimumQty.addRemoveClass("disabled", disabled);
        this.$.multipleQty.addRemoveClass("disabled", disabled);
        this.$.earliestDate.addRemoveClass("disabled", disabled);
      },
      setValue: function (value, options) {
        this.inherited(arguments);
        if (this.getShowDetail()) {
          var contract = value ? value.getValue("contract.number") : "",
            minimumQty = value ? value.get("minimumOrderQuantity") : 0,
            multipleQty = value ? value.get("multipleOrderQuantity") : 0,
            earliestDate = value ? XT.date.applyTimezoneOffset(value.get("earliestDate"), true) : null,
            scale = XT.QTY_SCALE;
          this.$.contractLabel.setShowing(contract);
          this.$.minimumQtyLabel.setShowing(minimumQty);
          this.$.minimumQty.setShowing(minimumQty);
          this.$.minimumQty.setContent(Globalize.format(minimumQty, "n" + scale));
          this.$.multipleQtyLabel.setShowing(multipleQty);
          this.$.multipleQty.setShowing(multipleQty);
          this.$.multipleQty.setContent(Globalize.format(multipleQty, "n" + scale));
          this.$.earliestDateLabel.setShowing(earliestDate);
          this.$.earliestDate.setShowing(earliestDate);
          this.$.earliestDate.setContent(Globalize.format(earliestDate, "d"));
        }
      }
    });

    // ..........................................................
    // PURCHASE VENDOR
    //

    enyo.kind({
      name: "XV.PurchaseVendorWidget",
      kind: "XV.VendorWidget",
      collection: "XM.PurchaseVendorRelationCollection"
    });

    // ..........................................................
    // VENDOR ADDRESS
    //

    enyo.kind({
      name: "XV.VendorAddressWidget",
      kind: "XV.RelationWidget",
      collection: "XM.VendorAddressRelationCollection",
      list: "XV.VendorAddressList",
      keyAttribute: "code",
      nameAttribute: ""
    });

  };

}());
