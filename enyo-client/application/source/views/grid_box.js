/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true, strict: false*/
/*global XM:true, XV:true, _:true, enyo:true, XT:true, Globalize:true */

(function () {
  var _readOnlyHeight = 57;


  enyo.kind({
    name: "XV.EditableList",
    kind: "XV.GridBox",
    classes: "large-panel",
    style: "padding: 0px;",
    events: {
      onWorkspace: ""
    },
    // XXX just like super but doWorkspace instead of doChildWorkspace
    buttonTapped: function (inSender, inEvent) {
      var model,
        that = this;

      switch (inEvent.originator.name) {
      case "addGridRowButton":
        this.newItem();
        break;
      case "deleteGridRowButton":
        // note that can't remove the model from the middle of the collection w/o error
        // we just destroy the model and hide the row.
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        model.destroy();
        this.setEditableIndex(null);
        this.$.editableGridRow.hide();
        this.valueChanged();
        break;
      case "expandGridRowButton":
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        this.unbindCollection();
        this.doWorkspace({ // CHANGED
          id: model.id, // NEW
          workspace: this.getWorkspace(),
          collection: this.getValue(),
          index: this.getValue().indexOf(model),
          callback: function () {
            that.bindCollection();
          }
        });
        break;
      }
    },
    create: function () {
      var that = this,
        Klass;

      this.inherited(arguments);

      this.$.newButton.setShowing(false);
      this.$.groupboxHeader.setShowing(false);

      //
      // Fetch the list
      //
      Klass = XT.getObjectByName(this.collection);
      this.setValue(new Klass());
      this.getValue().fetch({
        query: this.query,
        success: function () {
          that.valueChanged();
        }
      });
    },
    newItem: function () {
      var editableIndex = this.getValue().length,
        aboveListCount = this.liveModels(editableIndex - 1).length,
        Klass = this.getValue().model,
        model = new Klass(null, {isNew: true}),
        editor = this.$.editableGridRow;

      this.getValue().add(model);
      model.setStatus(XM.Model.READY_NEW); // NEW. HACK.
      this.setEditableIndex(editableIndex);
      this.valueChanged();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * aboveListCount) + "px");
      editor.setValue(model);
      editor.show();
      editor.render();
      editor.setFirstFocus();
    }
  });

  //
  // HONORIFIC
  //
  enyo.kind({
    name: "XV.HonorificEditableList",
    kind: "XV.EditableList",
    title: "_honorifics".loc(),
    collection: "XM.HonorificCollection",
    label: "_honorifics".loc(),
    query: {orderBy: [
      {attribute: 'code'}
    ]},
    columns: [
      {header: ["_code".loc()],
        rows: [
        {readOnlyAttr: "code",
          editor: {kind: "XV.InputWidget", attr: "code", placeholder: "_number".loc()}}
      ]}
    ],
    workspace: "XV.HonorificWorkspace"
  });

  //
  // PROJECT
  //
  enyo.kind({
    name: "XV.ProjectEditableList",
    kind: "XV.EditableList",
    title: "_projects".loc(),
    collection: "XM.ProjectListItemCollection",
    label: "_projects".loc(),
    query: {orderBy: [
      {attribute: 'number'}
    ]},
    columns: [
      {header: ["_number".loc(), "_name".loc()],
        rows: [
        {readOnlyAttr: "number",
          editor: {kind: "XV.InputWidget", attr: "number", placeholder: "_number".loc()}},
        {readOnlyAttr: "name",
          editor: {kind: "XV.InputWidget", attr: "name", placeholder: "_number".loc()}}
      ]}
    ],
    workspace: "XV.ProjectWorkspace"
  });

  // ..........................................................
  // SALES ORDER / QUOTE
  //

  //
  // The implementation of GridRow and GridBox is here in the workspace kind.
  // We could move them to a grid_box.js if we want. It is currently the only
  // implementation of GridRow and GridBox. Once we have a second, we'll probably
  // want to generalize this code and move it to enyo-x.
  //
  var salesOrderGridRow = {};
  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.mixin(salesOrderGridRow, XV.SalesOrderLineMixin);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    classes: "medium-panel",
    title: "_lineItems".loc(),
    columns: [
      {classes: "line-number", header: "#", rows: [
        {readOnlyAttr: "lineNumber",
          editor: {kind: "XV.NumberWidget", attr: "lineNumber"}}
      ]},
      {classes: "grid-item", header: "_item".loc(), rows: [
        {readOnlyAttr: "item.number",
          editor: {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}}},
        {readOnlyAttr: "item.description1"},
        {readOnlyAttr: "site.code"}
      ]},
      {classes: "quantity", header: "_quantity".loc(), rows: [
        {readOnlyAttr: "quantity",
          editor: {kind: "XV.QuantityWidget", attr: "quantity",
            name: "quantityWidget"}},
        {readOnlyAttr: "quantityUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "quantityUnit",
            name: "quantityUnitPicker", tabStop: false }}
      ]},
      {classes: "percent", header: "_discount".loc(), rows: [
        {readOnlyAttr: "discount",
          editor: {kind: "XV.PercentWidget", name: "discount",
            attr: "discount" }}
      ]},
      {classes: "price", header: "_price".loc(), rows: [
        {readOnlyAttr: "price",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "price", currency: ""},
            currencyDisabled: true, currencyShowing: false,
            scale: XT.SALES_PRICE_SCALE}},
        {readOnlyAttr: "priceUnit.name",
          editor: {kind: "XV.UnitCombobox", attr: "priceUnit",
            name: "priceUnitPicker",
            tabStop: false}},
        {readOnlyAttr: "extendedPrice",
          editor: {kind: "XV.MoneyWidget",
            attr: {localValue: "extendedPrice", currency: ""},
            currencyDisabled: true, currencyShowing: false,
            scale: XT.EXTENDED_PRICE_SCALE}}
      ]},
      {classes: "date", header: "_scheduled".loc(), rows: [
        {readOnlyAttr: "scheduleDate",
          editor: {kind: "XV.DateWidget", attr: "scheduleDate"}}
      ]}
    ],
    editorMixin: salesOrderGridRow,
    summary: "XV.SalesSummaryPanel",
    workspace: "XV.SalesOrderLineWorkspace",
    parentKey: "salesOrder"
  });

  var quoteGridRow = {};
  enyo.mixin(quoteGridRow, XV.LineMixin);
  enyo.mixin(quoteGridRow, XV.QuoteLineMixin);

  enyo.kind({
    name: "XV.QuoteLineItemGridBox",
    kind: "XV.SalesOrderLineItemGridBox",
    workspace: "XV.QuoteLineWorkspace",
    editorMixin: quoteGridRow,
    parentKey: "quote"
  });

}());
