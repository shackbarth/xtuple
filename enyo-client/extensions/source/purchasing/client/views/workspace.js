/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true*/

(function () {

  XT.extensions.purchasing.initWorkspaces = function () {

    var preferencesExtensions = [
      {kind: "XV.SitePicker", container: "mainGroup", attr: "PreferredWarehouse",
        label: "_defaultSite".loc() }
    ];
    XV.appendExtension("XV.UserPreferenceWorkspace", preferencesExtensions);

    // ..........................................................
    // CHARACTERISTIC
    //

    var extensions = [
      {kind: "XV.ToggleButtonWidget", attr: "isPurchaseOrders",
        label: "_purchaseOrders".loc(), container: "rolesGroup"},
    ];

    XV.appendExtension("XV.CharacteristicWorkspace", extensions);

    // ..........................................................
    // CONFIGURE
    //

    // TODO

    // ..........................................................
    // PURCHASE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.PurchaseEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_siteEmailProfile".loc(),
      model: "XM.PurchaseEmailProfile",
    });

    XV.registerModelWorkspace("XM.PurchaseEmailProfile", "XV.PurchaseEmailProfileWorkspace");

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypeWorkspace",
      kind: "XV.Workspace",
      title: "_purchaseType".loc(),
      model: "XM.PurchaseType",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "code"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.PurchaseEmailProfilePicker", attr: "emailProfile"},
              {kind: "XV.PurchaseTypeCharacteristicsWidget", attr: "characteristics"}
            ]}
          ]},
          {kind: "XV.PurchaseTypeWorkflowBox", attr: "workflow"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.PurchaseType", "XV.PurchaseTypeWorkspace");

    // ..........................................................
    // PURCHASE ORDER
    //

    enyo.kind({
      name: "XV.PurchaseOrderWorkspace",
      kind: "XV.Workspace",
      title: "_purchaseOrder".loc(),
      model: "XM.PurchaseOrder",
      printOnSaveSetting: "DefaultPrintPOOnSave",
      headerAttrs: ["number", "-", "vendor.name"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
                classes: "in-panel", fit: true, components: [
              {name: "overviewControl", components: [
                {kind: "XV.InputWidget", attr: "number"},
                {kind: "XV.DateWidget", attr: "orderDate"},
                {kind: "XV.DateWidget", attr: "releaseDate"},
                {kind: "XV.PurchaseOrderStatusPicker", attr: "status"},
                {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
                {kind: "XV.VendorWidget", attr: "vendor"},
                {kind: "XV.AddressFieldsWidget",
                  name: "vendorAddressWidget", attr:
                  {line1: "vendorAddress1",
                    line2: "vendorAddress2", line3: "vendorAddress3",
                    city: "vendorCity", state: "vendorState",
                    postalCode: "vendorPostalCode", country: "vendorCountry"}
                },
                {kind: "XV.ContactWidget", attr: "vendorContact"},
                {kind: "onyx.GroupboxHeader", content: "_shipTo".loc()},
                {kind: "XV.SitePicker", attr: "site", showNone: false},
                {kind: "XV.AddressFieldsWidget",
                  name: "destinationAddressWidget", attr:
                  {line1: "shiptoAddress1",
                    line2: "shiptoAddress2", line3: "shiptoAddress3",
                    city: "shiptoCity", state: "shiptoState",
                    postalCode: "shiptoPostalCode", country: "shiptoCountry"}
                },
                {kind: "XV.ContactWidget", attr: "shiptoContact"},
                {kind: "XV.ShipViaCombobox", attr: "shipVia"},
                {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
                {kind: "XV.TextArea", attr: "notes", fit: true}
              ]}
            ]}
          ]},
          {kind: "FittableRows", title: "_lineItems".loc(), name: "lineItemsPanel"},
          {kind: "XV.Groupbox", name: "settingsPanel", title: "_settings".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_settings".loc()},
            {kind: "XV.ScrollableGroupbox", name: "settingsGroup",
                classes: "in-panel", fit: true, components: [
              {name: "settingsControl", components: [
                {kind: "XV.PurchaseOrderStatusPicker", attr: "status"},
                {kind: "XV.PurchaseTypePicker", attr: "purchaseType"},
                {kind: "XV.TermsPicker", attr: "terms"},
                {kind: "XV.TaxZonePicker", attr: "taxZone"},
                {kind: "XV.AgentPicker", attr: "agent"},
                {kind: "XV.InputWidget", attr: "incoterms"},
                {kind: "XV.ShipViaCombobox", attr: "shipVia"},
                {kind: "XV.PurchaseOrderCharacteristicsWidget", attr: "characteristics"},
              ]}
            ]}
          ]},
          {kind: "FittableRows", title: "_workflow".loc(), name: "workflowPanel"},
          {kind: "XV.PurchaseOrderCommentBox", attr: "comments"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        if (enyo.platform.touch) {
          this.$.lineItemsPanel.createComponents([
            {kind: "XV.PurchaseOrderLineBox", name: "purchaseOrderLineItemBox",
              attr: "lineItems", fit: true}
          ], {owner: this});
          this.$.workflowPanel.createComponents([
            {kind: "XV.PurchaseOrderWorkflowBox", attr: "workflow", fit: true}
          ], {owner: this});
        } else {
          this.$.lineItemsPanel.createComponents([
            {kind: "XV.PurchaseOrderLineGridBox", name: "purchaseOrderLineItemBox",
              attr: "lineItems", fit: true}
          ], {owner: this});
          this.$.workflowPanel.createComponents([
            {kind: "XV.PurchaseOrderWorkflowGridBox", attr: "workflow", fit: true}
          ], {owner: this});
        }
        this.processExtensions(true);
      }
    });

    XV.registerModelWorkspace("XM.PurchaseOrderListItem", "XV.PurchaseOrderWorkspace");

    // ..........................................................
    // PURCHASE ORDER WORKFLOW
    //

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_purchaseOrderWorkflow".loc(),
      model: "XM.PurchaseOrderWorkflow",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.PurchaseOrderWorkflowTypePicker", attr: "workflowType"},
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
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onCompletedPanel", title: "_completionActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
            {kind: "XV.ScrollableGroupbox", name: "completionGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.PurchaseOrderStatusPicker", attr: "completedParentStatus",
                noneText: "_noChange".loc(), label: "_nextStatus".loc()},
              {kind: "XV.DependenciesWidget",
                attr: {workflow: "parent.workflow", successors: "completedSuccessors"}}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onDeferredPanel", title: "_deferredActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
            {kind: "XV.ScrollableGroupbox", name: "deferredGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.PurchaseOrderStatusPicker", attr: "completedParentStatus",
                noneText: "_noChange".loc(), label: "_nextStatus".loc()},
              {kind: "XV.DependenciesWidget",
                attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}}
            ]}
          ]}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.PurchaseOrderLineWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_purchaseOrderLine".loc(),
      model: "XM.PurchaseOrderLine",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "lineNumber"},
              {kind: "XV.ItemSiteWidget", attr: {item: "item", site: "site"}},
              {kind: "XV.CheckboxWidget", attr: "isMiscellaneous"},
              {kind: "XV.ExpenseCategoryWidget", attr: "expenseCategory"},
              {kind: "onyx.GroupboxHeader", content: "_quantity".loc()},
              {kind: "XV.QuantityWidget", attr: "quantity", label: "_ordered".loc()},
              {kind: "XV.QuantityWidget", attr: "toReceive"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "XV.QuantityWidget", attr: "vouchered"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "pricePanel", title: "_price".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_price".loc()},
            {kind: "XV.ScrollableGroupbox", name: "priceGroup", fit: true,
              classes: "in-panel", components: [
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
                label: "_freight".loc(), currencyShowing: true,
                currencyDisabled: true},
              {kind: "onyx.GroupboxHeader", content: "_tax".loc()},
              {kind: "XV.TaxTypePicker", attr: "taxType"},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "tax", currency: "currency"},
                scale: XT.PURCHASE_PRICE_SCALE,
                label: "_tax".loc(), currencyShowing: true,
                currencyDisabled: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "vendorPanel", title: "_itemSource".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
            {kind: "XV.ScrollableGroupbox", name: "itemSourceGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "vendorItemNumber", label: "_number".loc()},
              {kind: "XV.InputWidget", attr: "vendorUnit", label: "_unit".loc()},
              {kind: "XV.InputWidget", attr: "vendorUnitRatio", label: "_unitRatio".loc()},
              {kind: "onyx.GroupboxHeader", content: "_description".loc()},
              {kind: "XV.TextArea", attr: "vendorDescription", label: "_description".loc()},
              {kind: "onyx.GroupboxHeader", content: "_manufacturer".loc()},
              {kind: "XV.InputWidget", attr: "manufacturerName", label: "_name".loc()},
              {kind: "XV.InputWidget", attr: "manufacturerItemNumber", label: "_itemNumber".loc()},
              {kind: "onyx.GroupboxHeader", content: "_description".loc()},
              {kind: "XV.TextArea", attr: "manufacturerItemDescription", fit: true}
            ]}
          ]},
          {kind: "XV.PurchaseOrderLineCommentBox", attr: "comments"}
        ]}
      ]
    });

  };
}());
