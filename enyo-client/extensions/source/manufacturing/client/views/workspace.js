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
              {kind: "XV.InputWidget", attr: "unit.name", label: "_materialUnit".loc()},
              {kind: "XV.QuantityWidget", attr: "qtyRequired"},
              {kind: "XV.QuantityWidget", attr: "qtyIssued"},
              {kind: "onyx.GroupboxHeader", content: "_issue".loc()},
              {kind: "XV.QuantityWidget", attr: "toIssue", name: "toIssue", classes: "bold"},
            ]}
          ]},
          {kind: "XV.IssueStockDetailRelationsBox",
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
      saveText: "_post".loc(),
      hideApply: true,
      allowNew: false,
      dirtyWarn: false,
      events: {
        onPrevious: ""
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
              {kind: "XV.InputWidget", attr: "getWorkOrderStatusString", label: "_status".loc()},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "onyx.GroupboxHeader", content: "_options".loc()},
              {kind: "XV.CheckboxWidget", attr: "isBackflushMaterials"},
              {kind: "XV.StickyCheckboxWidget", label: "_closeWorkOrderAfterPosting".loc(),
                name: "closeWorkOrderAfterPosting"},
              {kind: "XV.StickyCheckboxWidget", label: "_scrapOnPost".loc(),
                name: "scrapOnPost"},
              {kind: "XV.QuantityWidget", attr: "ordered"},
              {kind: "XV.QuantityWidget", attr: "quantityReceived"},
              {kind: "XV.QuantityWidget", attr: "balance"},
              {kind: "onyx.GroupboxHeader", content: "_post".loc()},
              {kind: "XV.QuantityWidget", attr: "qtyToPost", name: "qtyToPost",
                onValueChange: "qtyToPostChanged"},
              {kind: "XV.QuantityWidget", attr: "undistributed", name: "undistributed"}
            ]}
          ]},
          {kind: "XV.PostProductionCreateLotSerialBox", attr: "detail", name: "detail"}
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
          this.$.qtyToPost.focus();
          this.$.qtyToPost.$.input.selectContents();
          this._started = true;
        }

        // Hide detail if not applicable
        if (!model.requiresDetail()) {
          this.$.detail.hide();
          this.$.undistributed.hide();
          this.parent.parent.$.menu.refresh();
        }

        this.$.detail.$.newButton.setDisabled(true);
      },

      //TODO - clean up the functionality of newItem() and doneItem() 
      // here and in PostProductionCreateLotSerialBox
      distributeRemaining: function () {
        var model = this.getValue(),
          undistributed = model.undistributed();
        if (!model.requiresDetail()) { return; }
        if (undistributed > 0) {
          this.$.detail.newItem();
        } else {
          //Can't create more distribution detail records than required
          this.$.detail.$.newButton.setDisabled(true);
        }
      },

      qtyToPostChanged: function (inSender, inEvent) {
        var model = this.getValue(),
          undistributed = model.get("undistributed"),
          qtyToPost = this.$.qtyToPost.getValue();
        model.set("qtyToPost", qtyToPost);
        //model.set("undistributed", model.undistributed());
        model.undistributed();
        this.distributeRemaining();
      },

      save: function () {
        this.inherited(arguments);
        var model = this.getValue(),
          that = this,
          callback,
          workspace = this,
          detailModels = this.$.detail.getValue(),
          detailModel,
          options = {},
          details = [],
          i = -1,
          params,
          workOrder = model.id,
          quantity = model.get("qtyToPost"),
          transDate = model.transactionDate,
          backflush = model.get("isBackflushMaterials");
        options.asOf = transDate;
        options.backflush = backflush;
        model.validate(function (isValid) {
          if (isValid) { callback(workspace); }
        });

        callback = function (workspace) {
          if (detailModels.length > 0) {
            i ++;
            if (i === detailModels.models.length) {
              if (detailModels.models[0]) {
                params = {
                  workOrder: model.id,
                  quantity: quantity,
                  options: options
                };
                XM.Manufacturing.postProduction(params, options);
                //TODO - Replace this hack
                workspace.getParent().getParent().doPrevious();
              } else {
                return;
              }
            } else {
              detailModel = detailModels.models[i];
              details.push({
                quantity: detailModel.getValue("quantity"),
                location: detailModel.getValue("location"),
                trace: detailModel.getValue("trace"),
                expiration: detailModel.getValue("expireDate"),
                warranty: detailModel.getValue("warrantyDate")
              });
              options.detail = details;
              callback(workspace);
            }
          } else {
            params = {
              workOrder: model.id,
              quantity: quantity,
              options: options
            };
            XM.Manufacturing.postProduction(params, options);
            //callback();
          }
        };
        callback(workspace);
      }
    });

  };
}());
