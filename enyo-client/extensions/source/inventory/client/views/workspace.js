/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.inventory.initWorkspaces = function () {
    var extensions;

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
              {kind: "onyx.GroupboxHeader", content: "_reporting".loc()},
              {kind: "XV.NumberWidget", attr: "DefaultEventFence",
                label: "_defaultEventFence".loc(), formatting: false},
            	//{kind: "XV.ToggleButtonWidget", attr: "EnableAsOfQOH",
              	//label: "_enableAsOfQOH".loc()},
              {kind: "onyx.GroupboxHeader", content: "_changeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WarehouseChangeLog",
                label: "_postSiteChanges".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "ItemSiteChangeLog",
                label: "_postItemSiteChanges".loc()},

              {kind: "onyx.GroupboxHeader", content: "_costing".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowAvgCostMethod",
                label: "_allowAvgCostMethod".loc()},
	      			//{kind: "XV.ToggleButtonWidget", attr: "AllowReceiptCostOverride",
                //label: "_allowReceiptCostOverride".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowStdCostMethod",
                label: "_allowStdCostMethod".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "AllowJobCostMethod",
                label: "_allowJobCostMethod".loc()},
	      			// Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "CountAvgCostMethod",
                label: "_countAvgCostMethod".loc(), collection: "XM.countAvgCostMethod"},
              
	      			{kind: "onyx.GroupboxHeader", content: "_physicalInventory".loc()},
              // Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "PostCountTagToDefault",
                label: "_postCountTagToDefault".loc(), collection: "XM.postCountTagToDefault"},      
	      			// Not bothering to define a kind
              {kind: "XV.PickerWidget", attr: "CountSlipAuditing",
                label: "_countSlipAuditing".loc(), collection: "XM.countSlipAuditing"},
              {kind: "onyx.GroupboxHeader", content: "_shippingAndReceiving".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "ShipmentNumberGeneration",
                label: "_shipmentNumberPolicy".loc()},
              {kind: "XV.NumberWidget", attr: "NextShipmentNumber",
                label: "_nextShipmentNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "KitComponentInheritCOS",
                label: "_kitComponentInheritCOS".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "DisallowReceiptExcessQty",
                label: "_disableReceiptExcessQty".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WarnIfReceiptQtyDiffers",
                label: "_warnIfReceiptQtyDiffers".loc()},
              {kind: "XV.NumberWidget", attr: "ReceiptQtyTolerancePct",
                label: "_receiptQtyTolerancePct".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "RecordPPVonReceipt",
                label: "_recordPPVOnReceipt".loc()}
            ]}
          ]}
        ]}
      ]
    });

  // ..........................................................
  // ORDER LINE
  //

  enyo.kind({
    name: "XV.OrderLineWorkspace",
    kind: "XV.Workspace",
    title: "_orderLine".loc(),
    headerAttrs: ["number", "-", "name"],
    model: "XM.OrderLine",
    handlers: {
      onSavePrompt: "savePrompt"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true, classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "lineNumber"},
            {kind: "XV.InputWidget", attr: "itemSite.item.number"},
            {kind: "XV.InputWidget", attr: "itemSite.item.description1"}    
					]}
				]}
			]},
      {kind: "onyx.Popup", name: "savePromptPopup", centered: true,
        modal: true, floating: true, scrim: true,
        onHide: "popupHidden", components: [
        {content: "_mustSave".loc() },
        {content: "_saveYourWork?".loc() },
        {tag: "br"},
        {kind: "onyx.Button", content: "_cancel".loc(), ontap: "savePromptCancel",
          classes: "xv-popup-button"},
        {kind: "onyx.Button", content: "_save".loc(), ontap: "savePromptSave",
          classes: "onyx-blue xv-popup-button"}
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      var K = XM.OrderLine.prototype,
        roles = K.roleAttributes.sort(),
        that = this;

      // Loop and add a role checkbox for each role attribute found on the model
      _.each(roles, function (role) {
        that.createComponent({
          kind: XV.OrderLineRoleCheckboxWidget,
          name: role + "Control",
          label: ("_" + role).loc(),
          attr: role,
          container: that.$.rolesGroup,
          owner: that
        });
      });

    },
    savePrompt: function (inSender, inEvent) {
      this._popupDone = false;
      this._inEvent = inEvent;
      this.$.savePromptPopup.show();
    },
    savePromptCancel: function () {
      this._popupDone = true;
      this._inEvent.callback(false);
      this.$.savePromptPopup.hide();
    },
    savePromptSave: function () {
      var that = this,
        options = {};
      options.success = function () {
        that._inEvent.callback(true);
      };
      this._popupDone = true;
      this.$.savePromptPopup.hide();
      this.save(options);
    }
  });

  XV.registerModelWorkspace("XM.OrderLine", "XV.OrderLineWorkspace");

  };

}());
