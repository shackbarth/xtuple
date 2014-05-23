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

    /* TODO:
      "BillDropShip",
      "EnableDropShipments",
      "NextVoucherNumber"
    */
    enyo.kind({
      name: "XV.PurchasingWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_purchasing".loc(),
      model: "XM.Purchasing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
              {kind: "XV.InputWidget", attr: "DefaultPOShipVia",
                label: "_defaultShipVia".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "VendorChangeLog",
                label: "_changeLog".loc()},
              {kind: "onyx.GroupboxHeader", content: "_purchaseOrder".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "PONumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextPurchaseOrderNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "POChangeLog",
                label: "_changeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "RequireStdCostForPOItem"},
              {kind: "XV.ToggleButtonWidget", attr: "DefaultPrintPOOnSave"},
              {kind: "XV.ToggleButtonWidget", attr: "UseEarliestAvailDateOnPOItem"},
              {kind: "XV.ToggleButtonWidget", attr: "RequirePOTax"},
              {kind: "onyx.GroupboxHeader", content: "_purchaseRequest".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "PrNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextPurchaseRequestNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "CopyPRtoPOItem"}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // ITEM
    //

    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_purchasing".loc(),
        container: "settingsGroup"},
      {kind: "XV.PurchasePriceWidget", attr: "maximumDesiredCost",
        container: "settingsGroup"}
    ];

    XV.appendExtension("XV.ItemWorkspace", extensions);

    // ..........................................................
    // ITEM SITE
    //

    extensions = [
      {kind: "XV.Groupbox", name: "supplyPanel", title: "_supply".loc(),
        components: [
        {kind: "onyx.GroupboxHeader", content: "_supply".loc()},
        {kind: "XV.CheckboxWidget", attr: "isPurchased", name: "isPurchased"}
      ], container: "panels"}
    ];

    XV.appendExtension("XV.ItemSiteWorkspace", extensions);

    // ..........................................................
    // ITEM SOURCE
    //

    enyo.kind({
      name: "XV.ItemSourceWorkspace",
      kind: "XV.Workspace",
      title: "_itemSource".loc(),
      model: "XM.ItemSource",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.ItemWidget", attr: "item"},
              {kind: "XV.VendorWidget", attr: "vendor"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.CheckboxWidget", attr: "isDefault"},
              {kind: "XV.QuantityWidget", attr: "multipleOrderQuantity"},
              {kind: "XV.QuantityWidget", attr: "minimumOrderQuantity"},
              {kind: "XV.NumberSpinnerWidget", attr: "leadTime"},
              {kind: "XV.NumberSpinnerWidget", attr: "ranking"},
              {kind: "XV.DateWidget", attr: "effective",
                nullValue: XT.date.startOfTime(),
                nullText: "_always".loc()},
              {kind: "XV.DateWidget", attr: "expires",
                nullValue: XT.date.endOfTime(),
                nullText: "_never".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", label: "_notes".loc()},
            ]}
          ]},
          {kind: "XV.Groupbox", name: "vendorPanel", title: "_vendor".loc(), components: [
            {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
            {kind: "XV.ScrollableGroupbox", name: "vendorGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "vendorItemNumber", label: "_number".loc()},
              {kind: "XV.UnitCombobox", attr: "vendorUnit", label: "_unit".loc(), showLabel: true},
              {kind: "XV.UnitRatioWidget", attr: "vendorUnitRatio", label: "_unitRatio".loc()},
              {kind: "XV.InputWidget", attr: "barcode"},
              {kind: "onyx.GroupboxHeader", content: "_description".loc()},
              {kind: "XV.TextArea", attr: "vendorItemDescription", label: "_description".loc()},
              {kind: "onyx.GroupboxHeader", content: "_manufacturer".loc()},
              {kind: "XV.InputWidget", attr: "manufacturerName", label: "_name".loc()},
              {kind: "XV.InputWidget", attr: "manufacturerItemNumber", label: "_number".loc()},
              {kind: "onyx.GroupboxHeader", content: "_description".loc()},
              {kind: "XV.TextArea", attr: "manufacturerItemDescription", fit: true}
            ]}
          ]},
          {kind: "XV.ItemSourcePriceBox", attr: "prices"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.ItemSource", "XV.ItemSourceWorkspace");

    // TODO

    // ..........................................................
    // PURCHASE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.PurchaseEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_purchaseEmailProfile".loc(),
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
      actions: [{
        name: "print",
        isViewMethod: true,
        label: "_print".loc(),
        privilege: "ViewPurchaseOrders",
        prerequisite: "isReadyClean"
      },
      {name: "email",
        isViewMethod: true,
        label: "_email".loc(),
        privilege: "ViewPurchaseOrders",
        prerequisite: "isReadyClean"
      }],
      headerAttrs: ["number", "-", "vendor.name"],
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "orderDate"},
              {kind: "XV.DateWidget", attr: "releaseDate"},
              {kind: "XV.PurchaseOrderStatusPicker", attr: "status"},
              {kind: "onyx.GroupboxHeader", content: "_source".loc()},
              {kind: "XV.PurchaseVendorWidget", attr: "vendor"},
              {kind: "XV.VendorAddressWidget", attr: "vendorAddress",
                label: "_address".loc()},
              {kind: "XV.AddressFieldsWidget",
                name: "vendorAddressFieldsWidget", attr:
                {name: "vendorAddressCode",
                  line1: "vendorAddress1",
                  line2: "vendorAddress2", line3: "vendorAddress3",
                  city: "vendorCity", state: "vendorState",
                  postalCode: "vendorPostalCode", country: "vendorCountry"}
              },
              {kind: "XV.ContactWidget", attr: "vendorContact",
                name: "vendorContactWidget"},
              {kind: "onyx.GroupboxHeader", content: "_shipTo".loc()},
              {kind: "XV.SitePicker", attr: "site", showNone: false},
              {kind: "XV.AddressFieldsWidget",
                name: "destinationAddressWidget", attr:
                {line1: "shiptoAddress1",
                  line2: "shiptoAddress2", line3: "shiptoAddress3",
                  city: "shiptoCity", state: "shiptoState",
                  postalCode: "shiptoPostalCode", country: "shiptoCountry"}
              },
              {kind: "XV.ContactWidget", attr: "shiptoContact",
                name: "shiptoContactWidget"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
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
          {kind: "XV.PurchaseOrderCommentBox", name: "commentsPanel", attr: "comments"}
        ]}
      ],
      attributesChanged: function (inSender, inEvent) {
        this.inherited(arguments);
        this.vendorChanged();
      },
      controlValueChanged: function (inSender, inEvent) {
        this.inherited(arguments);
        if (inEvent.originator.name === "vendorWidget") {
          this.vendorChanged();
        }
      },
      create: function () {
        this.inherited(arguments);
        if (enyo.platform.touch) {
          this.$.panels.createComponents([
            {kind: "XV.PurchaseOrderLineBox", name: "purchaseOrderLineItemBox",
              attr: "lineItems", addBefore: this.$.settingsPanel}
          ], {owner: this});
          this.$.panels.createComponents([
            {kind: "XV.PurchaseOrderWorkflowBox", attr: "workflow",
              addBefore: this.$.commentsPanel}
          ], {owner: this});
        } else {
          this.$.panels.createComponents([
            {kind: "XV.PurchaseOrderLineGridBox", name: "purchaseOrderLineItemBox",
              attr: "lineItems", addBefore: this.$.settingsPanel}
          ], {owner: this});
          this.$.panels.createComponents([
            {kind: "XV.PurchaseOrderWorkflowGridBox", attr: "workflow",
              addBefore: this.$.commentsPanel}
          ], {owner: this});
        }
        this.processExtensions(true);
      },
      vendorChanged: function () {
        var vendor = this.$.purchaseVendorWidget.getValue();
        if (vendor) {
          this.$.vendorContactWidget.addParameter({
            attribute: ["account", "accountParent"],
            value: vendor.id
          }, true);

          this.$.vendorAddressWidget.setDisabled(false);
          this.$.vendorAddressWidget.addParameter({
            attribute: "vendor",
            value: vendor.id
          });
        } else {
          this.$.vendorContactWidget.removeParameter("account");
          this.$.vendorAddressWidget.setDisabled(true);
        }
      }
    });

    XV.registerModelWorkspace("XM.PurchaseOrder", "XV.PurchaseOrderWorkspace");
    XV.registerModelWorkspace("XM.PurchaseOrderWorkflow", "XV.PurchaseOrderWorkspace");
    XV.registerModelWorkspace("XM.PurchaseOrderRelation", "XV.PurchaseOrderWorkspace");
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

    // ..........................................................
    // PURCHASE ORDER LINE
    //

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
              {kind: "XV.ProjectWidget", attr: "project"},
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
                currencyDisabled: true},
              {kind: "XV.PurchaseOrderLineCharacteristicsWidget",
                attr: "characteristics"}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "vendorPanel", title: "_itemSource".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
            {kind: "XV.ScrollableGroupbox", name: "itemSourceGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.ItemSourceWidget", label: "_number".loc(),
                attr: {itemSource: "itemSource", vendorItemNumber: "vendorItemNumber"}},
              {kind: "XV.InputWidget", attr: "vendorUnit", label: "_unit".loc()},
              {kind: "XV.InputWidget", attr: "vendorUnitRatio", label: "_unitRatio".loc()},
              {kind: "onyx.GroupboxHeader", content: "_description".loc()},
              {kind: "XV.TextArea", attr: "vendorItemDescription", label: "_description".loc()},
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
