/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.manufacturing.initLists = function () {

    // ..........................................................
    // ISSUE WORK ORDER MATERIALS
    //

    enyo.kind({
      name: "XV.IssueMaterialList",
      kind: "XV.List",
      label: "_issueMaterial".loc(),
      collection: "XM.IssueMaterialCollection",
      parameterWidget: "XV.IssueMaterialParameters",
      multiSelect: true,
      query: {orderBy: [
        {attribute: "order.number"},
        {attribute: "order.subnumber"}
      ]},
      showDeleteAction: false,
      actions: [
        {name: "issueMaterial", prerequisite: "canIssueMaterial",
          method: "issueMaterial", notify: false, isViewMethod: true},
        {name: "issueLine", prerequisite: "canIssueMaterial",
          method: "issueLine", notify: false, isViewMethod: true},
        {name: "returnLine", prerequisite: "canReturnMaterial",
          method: "returnMaterial", notify: false, isViewMethod: true}
      ],
      toggleSelected: true,
      published: {
        status: null
      },
      events: {
        onProcessingChanged: "",
        onOrderChanged: ""
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "itemSite.site.code",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "itemSite.item.number", fit: true}
              ]},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1",
                fit: true,  style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", components: [
              {kind: "XV.ListAttr", attr: "unit.name", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "qtyRequired",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "qtyIssued",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money bold", components: [
              {kind: "XV.ListAttr", attr: "balance",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate",
                formatter: "formatScheduleDate", style: "text-align: right"}
            ]}
          ]}
        ]}
      ],
      fetch: function () {
        this.inherited(arguments);
      },

      formatScheduleDate: function (value, view, model) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1 &&
            model.get("balance") > 0;
        view.addRemoveClass("error", isLate);
        return value;
      },

      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      /**
        Helper function for transacting `issue` on an array of models

        @param {Array} Models
        @param {Boolean} Prompt user for confirmation on every model
      */
      issue: function (models, prompt) {
        var that = this,
          i = -1,
          callback,
          data = [];

        // Recursively issue everything we can
        callback = function (workspace) {
          var model,
            options = {},
            toIssue,
            transDate,
            params,
            dispOptions = {},
            wsOptions = {},
            wsParams;

          // If argument is false, this whole process was cancelled
          if (workspace === false) {
            return;

          // If a workspace brought us here, process the information it obtained
          } else if (workspace) {
            model = workspace.getValue();
            toIssue = model.get("toIssue");
            transDate = model.transactionDate;

            if (toIssue) {
              wsOptions.detail = model.formatDetail();
              wsOptions.asOf = transDate;
              wsParams = {
                orderLine: model.id,
                quantity: toIssue,
                options: wsOptions
              };
              data.push(wsParams);
            }
            workspace.doPrevious();
          }

          i++;
          // If we've worked through all the models then forward to the server
          if (i === models.length) {
            that.doProcessingChanged({isProcessing: true});
            dispOptions.success = function () {
              that.doProcessingChanged({isProcessing: false});
            };
            XM.Manufacturing.issueMaterial(data, dispOptions);

          // Else if there's something here we can issue, handle it
          } else {
            model = models[i];
            toIssue = model.get("toIssue");
            transDate = model.transactionDate;

            // See if there's anything to issue here
            if (toIssue) {

              // If prompt or distribution detail required,
              // open a workspace to handle it
              if (prompt || model.undistributed()) {
                that.doWorkspace({
                  workspace: "XV.IssueMaterialWorkspace",
                  id: model.id,
                  callback: callback,
                  allowNew: false,
                  success: function (model) {
                    model.transactionDate = transDate;
                  }
                });

              // Otherwise just use the data we have
              } else {
                options.asOf = transDate;
                options.detail = model.formatDetail();
                params = {
                  orderLine: model.id,
                  quantity: toIssue,
                  options: options
                };
                data.push(params);
                callback();
              }

            // Nothing to issue, move on
            } else {
              callback();
            }
          }
        };
        callback();
      },
      issueAll: function () {
        var models = this.getValue().models;
        this.issue(models);
      },
      issueLine: function () {
        var models = this.selectedModels();
        this.issue(models);
      },
      issueMaterial: function () {
        var models = this.selectedModels();
        this.issue(models, true);
      },
      returnMaterial: function () {
        var models = this.selectedModels(),
          that = this,
          data =  [],
          options = {},
          qtyIssued,
          model,
          i;

        for (i = 0; i < models.length; i++) {
          model = models[i];
          qtyIssued = model.get("qtyIssued");

          // See if there's anything to issue here
          if (qtyIssued) {
            data.push(model.id);
          }
        }

        if (data.length) {
          that.doProcessingChanged({isProcessing: true});
          options.success = function () {
            that.doProcessingChanged({isProcessing: false});
          };
          XM.Manufacturing.returnMaterial(data, options);
        }
      },
      selectedModels: function () {
        var collection = this.getValue(),
          models = [],
          selected,
          prop;
        if (collection.length) {
          selected = this.getSelection().selected;
          for (prop in selected) {
            if (selected.hasOwnProperty(prop)) {
              models.push(this.getModel(prop - 0));
            }
          }
        }
        return models;
      },
      /**
        Overload: used to keep track of shipment.
      */
      /*
      setupItem: function (inSender, inEvent) {
        this.inherited(arguments);
        var collection = this.getValue(),
          listShipment = collection.at(inEvent.index).get("shipment"),
          listShipmentId = listShipment ? listShipment.id : false,
          shipment = this.getShipment(),
          shipmentId = shipment ? shipment.id : false;
        if (listShipmentId !== shipmentId) {
          this.setShipment(listShipment);
          // Update all rows to match
          _.each(collection.models, function (model) {
            model.set("shipment", listShipment);
          });
        }
      },*/
      orderChanged: function () {
        this.doOrderChanged({order: this.getOrder()});
      }
    });

    XV.registerModelList("XM.WorkOrderRelation", "XV.WorkOrderList");

  };
}());
