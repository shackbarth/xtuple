/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true,
Globalize:true */

(function () {

  enyo.kind({
    name: "XV.SalesOrderLineItemHeaders",
    classes: "xv-grid-row",
    components: [
      {classes: "xv-grid-header line-number", content: "#" },
      {classes: "xv-grid-header grid-item", content: "_item".loc()},
      {classes: "xv-grid-header quantity", content: "_quantity".loc()},
      {classes: "xv-grid-header discount", content: "_discount".loc()},
      {classes: "xv-grid-header price", content: "_price".loc()},
      {classes: "xv-grid-header schedule", content: "_schedDate".loc()}
    ]
  });

  enyo.kind({
    name: "XV.SalesOrderLineItemReadOnlyGridRow",
    kind: "XV.ReadOnlyGridRow",
    components: [
      {classes: "xv-grid-column line-number", components: [
        {name: "lineNumber"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {name: "itemNumber"},
        {name: "itemDescription"},
        {name: "siteCode"},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {name: "quantity"},
        {name: "quantityUnit"}
      ]},
      {classes: "xv-grid-column discount", components: [
        {name: "discount"}
      ]},
      {classes: "xv-grid-column price", components: [
        {name: "price"},
        {name: "priceUnit"},
        {name: "extendedPrice"}
      ]},
      {classes: "xv-grid-column schedule", components: [
        {name: "scheduleDate"}
      ]}
    ],
    valueChanged: function () {
      var model = this.getValue();
      if (!model) {
        return;
      }
      this.$.lineNumber.setContent(model.get("lineNumber"));
      this.$.itemNumber.setContent(model.getValue("item.number"));
      this.$.itemDescription.setContent(model.getValue("item.description1"));
      this.$.siteCode.setContent(model.getValue("site.code"));
      this.$.quantity.setContent(Globalize.format(XT.math.round(model.get("quantity"), XT.QTY_SCALE), "n" + XT.QTY_SCALE));
      this.$.quantityUnit.setContent(model.getValue("quantityUnit.name"));
      this.$.discount.setContent(Globalize.format(XT.math.round(model.get("discount"), XT.PERCENT_SCALE) * 100, "n" + XT.PERCENT_SCALE));

      this.$.price.setContent(Globalize.format(XT.math.round(model.get("price"), XT.SALES_PRICE_SCALE), "n" + XT.SALES_PRICE_SCALE));
      this.$.priceUnit.setContent(model.getValue("priceUnit.name"));
      this.$.extendedPrice.setContent(Globalize.format(XT.math.round(model.get("extendedPrice"),
        XT.EXTENDED_PRICE_SCALE), "n" + XT.EXTENDED_PRICE_SCALE));
      this.$.scheduleDate.setContent(Globalize.format(model.get("scheduleDate"), "d"));
    }
  });

  //
  // The implementation of GridRow and GridBox is here in the workspace kind.
  // We could move them to a grid_box.js if we want. It is currently the only
  // implementation of GridRow and GridBox. Once we have a second, we'll probably
  // want to generalize this code and move it to enyo-x.
  //
  var salesOrderGridRow = {
    name: "XV.SalesOrderLineItemGridRow",
    kind: "XV.GridRow",
    components: [
      // each field is grouped with its column header so that the alignment always
      // works out. All but the first column header will be invisible.
      {classes: "xv-grid-column line-number", components: [
        // Using XV.NumberWidget instead of XV.Number here (and elsewhere) because
        // of the pretty rounded corners, even though we have to hide the label with css
        {kind: "XV.NumberWidget", attr: "lineNumber"}
      ]},
      {classes: "xv-grid-column grid-item", components: [
        {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}},
      ]},
      {classes: "xv-grid-column quantity", components: [
        {kind: "XV.QuantityWidget", attr: "quantity", name: "quantityWidget"},
        {kind: "XV.UnitPickr", attr: "quantityUnit", name: "quantityUnitPicker" }
      ]},
      {classes: "xv-grid-column discount", components: [
        {kind: "XV.PercentWidget", name: "discount", attr: "discount" }
      ]},
      {classes: "xv-grid-column price", components: [
        {kind: "XV.MoneyWidget", attr:
          {localValue: "price", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.SALES_PRICE_SCALE},
        {kind: "XV.UnitPickr", attr: "priceUnit", name: "priceUnitPicker"},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "extendedPrice", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.EXTENDED_PRICE_SCALE}
      ]},
      {classes: "xv-grid-column schedule", components: [
        {kind: "XV.DateWidget", attr: "scheduleDate" }
      ]},
      {classes: "xv-grid-column grid-actions", components: [
        {components: [
          {kind: "enyo.Button", classes: "icon-plus", name: "addGridRowButton", onkeyup: "addButtonKeyup" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"}, classes: "icon-eye-open", name: "expandGridRowButton" },
          {kind: "enyo.Button", attributes: {tabIndex: "-1"}, classes: "icon-remove", name: "deleteGridRowButton" }
        ]}
      ]}
    ]
  };

  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);
  enyo.kind(salesOrderGridRow);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    associatedWorkspace: "XV.SalesOrderLineWorkspace",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
      {kind: "XV.SalesOrderLineItemHeaders"},
      {kind: "XV.Scroller", name: "mainGroup", horizontal: "hidden", fit: true, components: [
        {kind: "List", name: "aboveGridList", classes: "xv-above-grid-list", onSetupItem: "setupRowAbove", ontap: "gridRowTapAbove", components: [
          { kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "aboveGridRow"}
        ]},
        {kind: "XV.SalesOrderLineItemGridRow", name: "editableGridRow", showing: false},
        {kind: "List", name: "belowGridList", onSetupItem: "setupRowBelow", ontap: "gridRowTapBelow", components: [
          {kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "belowGridRow"}
        ]},
      ]},
      {
        kind: "FittableColumns",
        name: "navigationButtonPanel",
        classes: "xv-groupbox-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", onclick: "newItem",
            content: "_new".loc(), classes: "xv-groupbox-button-single"}
        ]
      },
      {kind: "XV.SalesSummaryPanel", name: "summaryPanel"}
    ],

    /**
      Set the current model into Summary Panel.
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.salesOrder;
      this.$.summaryPanel.setValue(model);
    }
  });
}());
