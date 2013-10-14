/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.inventory.initTransactionList = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingList",
      kind: "XV.TransactionList",
      label: "_issueToShipping".loc(),
      collection: "XM.IssueToShippingCollection",
      parameterWidget: "XV.IssueToShippingParameters",
      query: {orderBy: [
        {attribute: "lineNumber"},
        {attribute: "subNumber"}
      ]},
      published: {
        shipment: null,
        transModule: XM.Inventory,
        transWorkspace: "XV.IssueStockWorkspace"
      },
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber"},
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
              {kind: "XV.ListAttr", attr: "ordered",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "balance",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "atShipping",
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
        this.setShipment(null);
        this.inherited(arguments);
      },
      formatScheduleDate: function (value, view, model) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1 &&
            model.get("balance") > 0;
        view.addRemoveClass("error", isLate);
        return value;
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subNumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
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
      */ /*
      issue: function (models, prompt, issueStock) {
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
            if (data[0]) {
              that.doProcessingChanged({isProcessing: true});
              dispOptions.success = function () {
                that.doProcessingChanged({isProcessing: false});
              };
              XM.Inventory.issueToShipping(data, dispOptions);
            } else {
              return;
            }

          // Else if there's something here we can issue, handle it
          } else {
            model = models[i];
            toIssue = model.get("toIssue");
            transDate = model.transactionDate;

            // See if there's anything to issue here
            if (toIssue || issueStock) {

              // If prompt or distribution detail required,
              // open a workspace to handle it
              if (prompt || model.undistributed()) {
                that.doWorkspace({
                  workspace: "XV.IssueStockWorkspace",
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
      issueStock: function () {
        var models = this.selectedModels();
        this.issue(models, true, true);
      },
      returnStock: function () {
        var models = this.selectedModels(),
          that = this,
          data =  [],
          options = {},
          atShipping,
          model,
          i;

        for (i = 0; i < models.length; i++) {
          model = models[i];
          atShipping = model.get("atShipping");

          // See if there's anything to issue here
          if (atShipping) {
            data.push(model.id);
          }
        }

        if (data.length) {
          that.doProcessingChanged({isProcessing: true});
          options.success = function () {
            that.doProcessingChanged({isProcessing: false});
          };
          XM.Inventory.returnFromShipping(data, options);
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
      }, */
      /**
        Overload: used to keep track of shipment.
      */
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
      },
      shipmentChanged: function () {
        this.doShipmentChanged({shipment: this.getShipment()});
      }
    });

    XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");
  };

}());
