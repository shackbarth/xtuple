/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize: true*/

(function () {

  XT.extensions.manufacturing.initWorkspaces = function () {

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.ManufacturingWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_manufacturing".loc(),
      model: "XM.Manufacturing",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_workOrder".loc()},
              {kind: "XV.NumberPolicyPicker", attr: "WONumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.NumberWidget", attr: "NextWorkOrderNumber",
                label: "_nextNumber".loc(), formatting: false},
              {kind: "XV.ToggleButtonWidget", attr: "AutoExplodeWO",
                label: "_autoExplodeWO".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "WorkOrderChangeLog",
                label: "_workOrderChangeLog".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "PostMaterialVariances",
                label: "_postMaterialVariances".loc()},
              {kind: "XV.PickerWidget", attr: "explodeWOEffective",
                label: "_explodeWorkOrderEffective".loc(), collection: "XM.explodeWOEffective"},
              {kind: "XV.PickerWidget", attr: "woExplosionLevel",
                label: "_woExplosionLevel".loc(), collection: "XM.woExplosionLevel"},
              {kind: "XV.PickerWidget", attr: "jobItemCosDefault",
                label: "_jobItemCosDefault".loc(), collection: "XM.jobItemCosDefault"}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // ISSUE MATERIAL
    //

    enyo.kind({
      name: "XV.IssueMaterialWorkspace",
      kind: "XV.IssueStockWorkspace",
      title: "_issueMaterial".loc(),
      model: "XM.IssueMaterial",
      saveText: "_issue".loc(),
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_order".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.WorkOrderWidget", attr: "order"},
              {kind: "onyx.GroupboxHeader", content: "_item".loc()},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "unit.name"},
              {kind: "XV.QuantityWidget", attr: "qtyRequired"},
              {kind: "XV.QuantityWidget", attr: "qtyIssued"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue", classes: "bold"},
            ]}
          ]},
          {kind: "XV.IssueMaterialDetailRelationsBox",
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
      ]
    });

    // ..........................................................
    // POST PRODUCTION
    //

    enyo.kind({
      name: "XV.PostProductionWorkspace",
      kind: "XV.Workspace",
      title: "_postProduction".loc(),
      model: "XM.PostProduction",
      reportModel: "XM.WorkOrder",
      saveText: "_post".loc(),
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
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.ItemSiteWidget", attr:
                {item: "itemSite.item", site: "itemSite.site"}
              },
              {kind: "XV.InputWidget", attr: "status"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "productionNotes", fit: true},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.StickyCheckboxWidget", label: "_backflushMaterials".loc(),
                name: "backflushMaterials"},
              {kind: "XV.StickyCheckboxWidget", label: "_closeWorkOrderAfterPosting".loc(),
                name: "closeWorkOrderAfterPosting"},
              {kind: "XV.StickyCheckboxWidget", label: "_scrapOnPost".loc(),
                name: "scrapOnPost"},
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "quantityReceived"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "onyx.GroupboxHeader", content: "_post".loc()},
              {kind: "XV.QuantityWidget", attr: "qtyToPost", name: "qtyToPost"}
            ]}
          ]}
          //{kind: "XV.ShipmentLineRelationsBox", attr: "lineItems"}
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
          this.$.qtyToPost.focus();
          this.$.qtyToPost.$.input.selectContents();
          this._started = true;
        }
      }/*,
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
      }*/
    });

  };
}());
