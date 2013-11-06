/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true, _:true*/

(function () {

  XT.extensions.inventory.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.InventoryWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_inventory".loc(),
      model: "XM.Inventory",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_changeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WarehouseChangeLog",
                label: "_postSiteChanges".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "ItemSiteChangeLog",
                label: "_postItemSiteChanges".loc()},
              {kind: "onyx.GroupboxHeader", content: "_costing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowAvgCostMethod",
                label: "_allowAvgCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowStdCostMethod",
                label: "_allowStdCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowJobCostMethod",
                label: "_allowJobCostMethod".loc()}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "shippingPanel", title: "_shipping".loc(), components: [
            {kind: "XV.ScrollableGroupbox", name: "shippingGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_shipping".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "ShipmentNumberGeneration",
                label: "_shipmentNumberPolicy".loc()},
              {kind: "XV.NumberWidget", attr: "NextShipmentNumber",
                label: "_nextShipmentNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "KitComponentInheritCOS",
                label: "_kitComponentInheritCOS".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // ENTER RECEIPT
    //

    enyo.kind({
      name: "XV.EnterReceiptWorkspace",
      kind: "XV.Workspace",
      title: "_enterReceipt".loc(),
      model: "XM.PurchaseOrderLine",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.PurchaseOrderWidget", attr: "purchaseOrder"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "received"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "onyx.GroupboxHeader", content: "_receive".loc()},
              {kind: "XV.QuantityWidget", attr: "toReceive", name: "toReceive"},
            ]}
          ]},
        ]}
      ],
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();
        if (!this._focused && model &&
          model.getStatus() === XM.Model.READY_DIRTY) {
          this.$.toReceive.focus();
          this.$.toReceive.$.input.selectContents();
          this._focused = true;
        }
      }
    });

    XV.registerModelWorkspace("XM.PurchaseOrderLine", "XV.EnterReceiptWorkspace");

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueStockWorkspace",
      kind: "XV.Workspace",
      title: "_issueStock".loc(),
      model: "XM.IssueToShipping",
      backText: "_cancel".loc(),
      saveText: "_issue".loc(),
      hideApply: true,
      hideRefresh: true,
      dirtyWarn: false,
      events: {
        onPrevious: ""
      },
      handlers: {
        onDetailSelectionChanged: "toggleDetailSelection",
        onDistributedTapped: "distributedTapped"
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.SalesOrderWidget", attr: "order"},
              {kind: "XV.ShipmentWidget", attr: "shipment"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "unit.name", label: "_issueUnit".loc()},
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "shipped"},
              {kind: "XV.QuantityWidget", attr: "returned"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "XV.QuantityWidget", attr: "atShipping"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue"},
            ]}
          ]},
          {kind: "XV.IssueToShippingDetailRelationsBox",
            attr: "itemSite.detail", name: "detail"}
        ]},
        {kind: "onyx.Popup", name: "distributePopup", centered: true,
          onHide: "popupHidden",
          modal: true, floating: true, components: [
          {content: "_quantity".loc()},
          {kind: "onyx.InputDecorator", components: [
            {kind: "onyx.Input", name: "quantityInput"}
          ]},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "distributeOk",
            classes: "onyx-blue xv-popup-button"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "distributeDone",
            classes: "xv-popup-button"},
        ]}
      ],
      /**
        Overload: Some special handling for start up.
        */
      attributesChanged: function () {
        this.inherited(arguments);
        var model = this.getValue();

        // Focus and select qty on start up.
        if (!this._started && model &&
          model.getStatus() === XM.Model.READY_DIRTY) {
          this.$.toIssue.focus();
          this.$.toIssue.$.input.selectContents();
          this._started = true;
        }

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.parent.parent.$.menu.refresh();
        }
      },
      /**
        Overload to handle callback chain.
      */
      destroy: function () {
        var model = this.getValue(),
          callback = this.getCallback();

        // If there's a callback then call it with false
        // to let it know to cancel process
        if (model.isDirty() && callback) {
          callback(false);
        }
        this.inherited(arguments);
      },

      distributeDone: function () {
        this._popupDone = true;
        delete this._distModel;
        this.$.distributePopup.hide();
      },
      distributeOk: function () {
        var qty = this.$.quantityInput.getValue(),
          dist = this._distModel;
        qty = Globalize.parseFloat(qty);
        dist.set("distributed", qty);
        if (dist._validate(dist.attributes, {})) {
          this.distributeDone();
          this.$.detail.$.list.refresh();
        }
      },
      distributedTapped: function (inSender, inEvent) {
        var input = this.$.quantityInput,
          qty = inEvent.model.get("distributed");
        this._popupDone = false;
        this._distModel = inEvent.model;
        this.$.distributePopup.show();
        qty = Globalize.format(qty, "n" + XT.QTY_SCALE);
        input.setValue(qty);
        input.focus();
        input.selectContents();
      },
      popupHidden: function (inSender, inEvent) {
        if (!this._popupDone) {
          inEvent.originator.show();
        }
      },
      /**
        Overload: This version of save just validates the model and forwards
        on to callback. Designed specifically to work with `XV.IssueToShippingList`.
      */
      save: function () {
        var callback = this.getCallback(),
          model = this.getValue(),
          workspace = this;
        model.validate(function (isValid) {
          if (isValid) { callback(workspace); }
        });
      },
      /**
        If detail has been selected or deselected, handle default distribution.
      */
      toggleDetailSelection: function (inSender, inEvent) {
        var detail = inEvent.model,
          isDistributed = detail.get("distributed") > 0,
          undistributed;
        if (!detail) { return; }
        if (isDistributed) {
          detail.clear();
        } else {
          undistributed = this.getValue().undistributed();
          detail.distribute(undistributed);
        }
      }
    });

    // ..........................................................
    // LOCATION
    //

    enyo.kind({
      name: "XV.LocationWorkspace",
      kind: "XV.Workspace",
      title: "_location".loc(),
      model: "XM.Location",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_location".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.SiteZonePicker", attr: "siteZone"},
              {kind: "XV.CheckboxWidget", attr: "isNetable"},
              {kind: "XV.CheckboxWidget", attr: "isRestricted"},
              {kind: "XV.InputWidget", attr: "aisle"},
              {kind: "XV.InputWidget", attr: "rack"},
              {kind: "XV.InputWidget", attr: "bin"},
              {kind: "XV.InputWidget", attr: "location"},
              {kind: "XV.TextArea", fit: true, attr: "description"},
            ]}
          ]},
          {kind: "XV.LocationItemRelationBox", attr: "items"}
        ]}
      ],
      //TODO get the following working
      isRestrictedDidChange: function () {
        var model = this.getValue(),
          isRestricted = model ? model.get("isRestricted") : false;
        if (!isRestricted) {
          this.$.locationItemRelationBox.setDisabled(true);
        }
      }
    });

    XV.registerModelWorkspace("XM.Location", "XV.LocationWorkspace");
    XV.registerModelWorkspace("XM.LocationItem", "XV.LocationWorkspace");

    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentWorkspace",
      kind: "XV.Workspace",
      title: "_shipment".loc(),
      model: "XM.Shipment",
      allowPrint: true,
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.CheckboxWidget", attr: "isShipped"},
              {kind: "XV.ShipmentSalesOrderWidget", attr: "order"},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget",
                attr: {localValue: "freight", currency: "currency"},
                label: "_freight".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.ShipmentLine", "XV.ShipmentWorkspace");
    XV.registerModelWorkspace("XM.ShipmentListItem", "XV.ShipmentWorkspace");

    enyo.kind({
      name: "XV.ShipShipmentWorkspace",
      kind: "XV.Workspace",
      title: "_shipShipment".loc(),
      model: "XM.ShipShipment",
      reportModel: "XM.Shipment",
      saveText: "_ship".loc(),
      allowNew: false,
      hideApply: true,
      dirtyWarn: false,
      events: {
        onPrint: ""
      },
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "shipDate"},
              {kind: "XV.ShipmentSalesOrderWidget", attr: "order"},
              {kind: "XV.MoneyWidget", label: "_value".loc(),
                attr: {localValue: "value", currency: "currency"}},
              {kind: "XV.ShipViaCombobox", attr: "shipVia"},
              {kind: "XV.InputWidget", attr: "trackingNumber"},
              {kind: "XV.MoneyWidget", label: "_freight".loc(),
                attr: {localValue: "freight", currency: "order.currency"}},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.StickyCheckboxWidget", label: "_printPacklist".loc(),
                name: "printPacklist"}
            ]}
          ]},
          {kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
        ]}
      ],
      create: function (options) {
        this.inherited(arguments);
        if (!this.getBiAvailable()) {
          this.$.printPacklist.setChecked(false);
          this.$.printPacklist.setDisabled(true);
        }
      },
      save: function (options) {
        if (this.$.printPacklist.isChecked()) {
          this.doPrint();
        }
        this.inherited(arguments);
      }
    });

    // ..........................................................
    // ITEM SITE
    //

    var extensions = [
      {kind: "XV.Groupbox", name: "inventoryPanel", title: "_inventory".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_inventory".loc()},
        {kind: "XV.ScrollableGroupbox", name: "inventoryGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ControlMethodPicker", attr: "controlMethod"},
          {kind: "XV.CostMethodPicker", attr: "costMethod"},
          {kind: "XV.CheckboxWidget", attr: "isStocked"},
          {kind: "XV.AbcClassPicker", attr: "abcClass"},
          {kind: "XV.ToggleButtonWidget", attr: "isAutomaticAbcClassUpdates"},
          {kind: "XV.NumberWidget", attr: "cycleCountFrequency", scale: 0}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "planningPanel", title: "_planning".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_planning".loc()},
        {kind: "XV.ScrollableGroupbox", name: "planningGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.QuantityWidget", attr: "safetyStock"},
          {kind: "XV.NumberWidget", attr: "leadTime", scale: 0},
          {kind: "onyx.GroupboxHeader", content: "_parameters".loc() },
          {kind: "XV.ToggleButtonWidget", attr: "useParameters"},
          {kind: "XV.QuantityWidget", attr: "reorderLevel"},
          {kind: "XV.QuantityWidget", attr: "orderToQuantity"},
          {kind: "XV.QuantityWidget", attr: "minimumOrderQuantity"},
          {kind: "XV.QuantityWidget", attr: "maximumOrderQuantity"},
          {kind: "XV.QuantityWidget", attr: "multipleOrderQuantity"},
          {kind: "XV.ToggleButtonWidget", attr: "useParametersManual"}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "locationPanel", title: "_locationControl".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_locationControl".loc()},
        {kind: "XV.ScrollableGroupbox", name: "locationGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ToggleButtonWidget", attr: "isLocationControl",
            label: "_multipleLocationControl".loc()},
          {kind: "XV.InputWidget", attr: "locationComment"},
          {kind: "XV.CheckboxWidget", attr: "useDefaultLocation"},
          {kind: "XV.InputWidget", attr: "userDefinedLocation"},
          {kind: "XV.LocationPicker", attr: "receiveLocation"},
          {kind: "XV.ToggleButtonWidget", attr: "isReceiveLocationAuto"},
          {kind: "XV.LocationPicker", attr: "stockLocation"},
          {kind: "XV.ToggleButtonWidget", attr: "isStockLocationAuto"}
        ]}
      ]},
      {kind: "XV.Groupbox", name: "restrictedPanel", title: "_restrictedLocations".loc(),
        container: "panels", components: [
        {kind: "onyx.GroupboxHeader", content: "_restrictedLocationsAllowed".loc()},
        {kind: "XV.ScrollableGroupbox", name: "restrictedGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.ItemSiteRestrictedLocationAssignmentBox",
            attr: "restrictedLocationsAllowed", name: "restrictedLocations" }
        ]}
      ]}
    ];

    XV.appendExtension("XV.ItemSiteWorkspace", extensions);

    // Add in handling for cost methods
    var _proto = XV.ItemSiteWorkspace.prototype,
      _recordIdChanged = _proto.recordIdChanged,
      _newRecord = _proto.newRecord,
      _statusChanged = _proto.statusChanged;

    var ext = {
      newRecord: function () {
        _newRecord.apply(this, arguments);
        this.setupPicker();
        this.setupRestricted();
      },
      recordIdChanged: function () {
        _recordIdChanged.apply(this, arguments);
        this.setupPicker();
      },
      refreshCostMethods: function () {
        this.$.costMethodPicker.buildList();
      },
      refreshRestricted: function () {
        this.$.restrictedLocations.setSite(this.getValue().get("site"));
      },
      statusChanged: function () {
        _statusChanged.apply(this, arguments);
        var value = this.getValue(),
          status = value ? value.getStatus() : false;

        if (status === XM.Model.READY_CLEAN) {
          this.refreshRestricted();
        }
      },
      setupPicker: function () {
        var picker = this.$.costMethodPicker,
          model = this.getValue();

        // Remove any binding
        if (picker._model) {
          picker._model.off("costMethodsChange", this.refreshCostMethods, this);
          delete picker._model;
        }
        
        // Add a new one
        if (model && model.id) {
          model.on("costMethodsChange", this.refreshCostMethods, this);
          picker._model = model; // Cache for future reference
        }
      },
      setupRestricted: function () {
        var restricted = this.$.restrictedLocations,
          model = this.getValue();

        // Remove any binding
        if (restricted._model) {
          restricted._model.off("change:site", this.refreshRestricted, this);
          delete restricted._model;
        }
        
        // Add a new one
        if (model && model.id) {
          model.on("change:site", this.refreshRestricted, this);
          restricted._model = model; // Cache for future reference
        }
      }
    };

    enyo.mixin(_proto, ext);

  };
}());
