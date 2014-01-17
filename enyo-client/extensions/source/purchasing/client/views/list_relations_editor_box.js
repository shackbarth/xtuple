/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.purchasing.initListRelationsEditorBox = function () {

    // ..........................................................
    // ITEM SOURCE PRICE
    //

    enyo.kind({
      name: "XV.ItemSourcePriceEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "quantityBreak"},
          {kind: "XV.SitePicker", attr: "site", showNone: true,
            noneText: "_any".loc()},
          {kind: "XV.ItemSourcePriceTypePicker", attr: "priceType"},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "price", currency: "currency"},
            label: "_price".loc(), currencyShowing: true,
            scale: XT.PURCHASE_PRICE_SCALE,
            currencyDisabled: false},
          {kind: "XV.PercentWidget", attr: "percentDiscount", label: "percent".loc()},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "fixedDiscount", currency: "currency"},
            label: "_fixed".loc(), currencyShowing: true,
            scale: XT.PURCHASE_PRICE_SCALE,
            currencyDisabled: false},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "itemSource.item.wholesalePrice"},
            label: "_wholesalePrice".loc(), currencyShowing: true,
            currencyDisabled: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.ItemSourcePriceBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_prices".loc(),
      editor: "XV.ItemSourcePriceEditor",
      parentKey: "itemSource",
      listRelations: "XV.ItemSourcePriceListRelations",
      fitButtons: false
    });

    // ..........................................................
    // PURCHASE ORDER LINE
    //

    /**
      Mixin for Purchase Order Line functions
    */
    XV.PurchaseOrderLineMixin = {
      setValue: function (value) {
        XV.RelationsEditor.prototype.setValue.apply(this, arguments);
        var K = XM.Item,
          param = {
            attribute: "item.itemType",
            operator: "ANY",
            value: [K.PURCHASED, K.OUTSIDE_PROCESS, K.TOOLING, K.MANUFACTURED]
          },
          itemSourceWidget = this.$.itemSourceWidget,
          parent,
          parentSite,
          childSite,
          vendor,
          itemSourceRequired;

        // Add new bindings
        if (this.value) {
          parent = value.getParent();

          // Handle Site
          parentSite = parent ? parent.get("site") : false;
          childSite = this.$.itemSiteWidget.getSite();
          if (parentSite && !childSite) {
            this.$.itemSiteWidget.setSite(parentSite);
          }

          // Handle Vendor
          vendor = parent ? parent.get("vendor") : false;
          if (vendor) {
            itemSourceRequired = vendor ? vendor.get("itemSourceRequired") : false;
            param = {
              attribute: "vendor",
              value: vendor.id
            };
            this.changeItemSiteParameter("vendor", "vendor", itemSourceRequired);
            
            if (itemSourceWidget) {
              itemSourceWidget.addParameter(param);
            }
          }

          // Handle Item types
          param = {
            attribute: "item.itemType",
            operator: "ANY",
            value: [K.PURCHASED, K.OUTSIDE_PROCESS, K.TOOLING, K.MANUFACTURED]
          };
          if (itemSourceRequired) {
            this.$.itemSiteWidget.removeParameter(param);
          } else {
            this.$.itemSiteWidget.addParameter(param);
          }
        }
      },
      // Borrow from XV.LineMixin for Sales Orders and Quotes
      changeItemSiteParameter: XV.LineMixin.changeItemSiteParameter
    };
    
    var lineEditor = {
      name: "XV.PurchaseOrderLineEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "lineNumber"},
          {kind: "XV.CheckboxWidget", attr: "isMisc"},
          {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"},
            query: {parameters: [
            {attribute: "isActive", value: true}
          ]}},
          {kind: "XV.ExpenseCategoryWidget", attr: "expenseCategory"},
          {kind: "XV.QuantityWidget", attr: "quantity", label: "_ordered".loc()},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "onyx.GroupboxHeader", content: "_price".loc()},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "price", currency: "currency"},
            scale: XT.PURCHASE_PRICE_SCALE,
            label: "_unitPrice".loc(), currencyShowing: true,
            currencyDisabled: true},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "extendedPrice", currency: "currency"},
            label: "_extendedPrice".loc(), currencyShowing: true,
            currencyDisabled: true},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "freight", currency: "currency"},
            label: "_extendedPrice".loc(), currencyShowing: true,
            currencyDisabled: true},
          {kind: "onyx.GroupboxHeader", content: "_tax".loc()},
          {kind: "XV.TaxTypePicker", attr: "taxType"},
          {kind: "XV.MoneyWidget",
            attr: {localValue: "tax", currency: "currency"},
            scale: XT.PURCHASE_PRICE_SCALE,
            label: "_extendedPrice".loc(), currencyShowing: true,
            currencyDisabled: true},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    };

    enyo.mixin(lineEditor, XV.PurchaseOrderLineMixin);
    enyo.kind(lineEditor);

    enyo.kind({
      name: "XV.PurchaseOrderLineBox",
      kind: "XV.ListRelationsEditorBox",
      classes: "xv-list-relations-box",
      title: "_lines".loc(),
      editor: "XV.PurchaseOrderLineEditor",
      parentKey: "purchaseOrder",
      listRelations: "XV.PurchaseOrderLineListRelations",
      fitButtons: false
    });

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.WorkflowStatusPicker", attr: "status"},
          {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
          {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
          {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
          {kind: "XV.DateWidget", attr: "dueDate"},
          {kind: "XV.DateWidget", attr: "startDate"},
          {kind: "XV.DateWidget", attr: "assignDate"},
          {kind: "XV.DateWidget", attr: "completeDate"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.PurchaseOrderStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.PurchaseOrderStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc()},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.PurchaseOrderWorkflowEditor",
      parentKey: "purchaseOrder",
      listRelations: "XV.PurchaseOrderWorkflowListRelations",
      fitButtons: false
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeWorkflowEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"},
          {kind: "XV.WorkflowStatusPicker", attr: "status"},
          {kind: "XV.PurchaseOrderWorkflowTypePicker", attr: "workflowType",
            label: "_type".loc()},
          {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
          {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
          {kind: "onyx.GroupboxHeader", content: "_startDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "startSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "startOffset"},
          {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
          {kind: "XV.ToggleButtonWidget", attr: "dueSet"},
          {kind: "XV.NumberSpinnerWidget", attr: "dueOffset"},
          {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
          {kind: "XV.UserAccountWidget", attr: "owner"},
          {kind: "XV.UserAccountWidget", attr: "assignedTo"},
          {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
          {kind: "XV.PurchaseOrderStatusPicker", attr: "completedParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc(),
            showNone: true},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "completedSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
          {kind: "XV.PurchaseOrderStatusPicker", attr: "deferredParentStatus",
            noneText: "_noChange".loc(), label: "_nextStatus".loc(),
            showNone: true},
          {kind: "XV.DependenciesWidget",
            attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}},
          {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
          {kind: "XV.TextArea", attr: "notes", fit: true}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PurchaseTypeWorkflowBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_workflow".loc(),
      editor: "XV.PurchaseTypeWorkflowEditor",
      parentKey: "purchaseType",
      listRelations: "XV.PurchaseTypeWorkflowListRelations",
      fitButtons: false
    });

    enyo.kind({
      name: "XV.PurchaseOrderSummaryPanel",
      classes: "xv-sales-summary-panel",
      kind: "XV.RelationsEditor",
      style: "margin-top: 10px;",
      components: [
        {kind: "XV.Groupbox", name: "totalGroup", classes: "xv-sales-summary-total-group",
            components: [
          {kind: "onyx.GroupboxHeader", content: "_summary".loc()},
          {kind: "FittableColumns", name: "totalBox", classes: "xv-totals-panel", components: [
            {kind: "FittableRows", name: "summaryColumnOne", components: [
              {kind: "XV.CurrencyPicker", attr: "currency"}
            ]},
            {kind: "FittableRows", name: "summaryColumnTwo", components: [
              {kind: "XV.MoneyWidget",
               attr: {localValue: "subtotal", currency: "currency"},
               label: "_subtotal".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "freightSubtotal", currency: "currency"},
               label: "_freightSubtotal".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "freight", currency: "currency"},
               label: "_freight".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget",
               attr: {localValue: "taxTotal", currency: "currency"},
               label: "_tax".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget",
               attr: {localValue: "total", currency: "currency"},
               label: "_total".loc(), currencyShowing: false}
            ]}
          ]}
        ]}
      ]
    });

  };

}());
