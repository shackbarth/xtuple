/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XM:true, _:true, XT:true, XV:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.inventory.initLists = function () {

    // ..........................................................
    // BACKLOG REPORT
    //

    enyo.kind({
      name: "XV.SalesOrderLineListItem",
      kind: "XV.List",
      label: "_backlog".loc(),
      collection: "XM.SalesOrderLineListItemCollection",
      query: {orderBy: [
        {attribute: "salesOrder.number"},
        {attribute: "lineNumber"},
        {attribute: "subNumber"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "FittableColumns", name: "header", classes: "header", headerAttr: "salesOrder.number", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true, classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "first", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.customer.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.shiptoName", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.scheduleDate", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.salesRep.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.total", formatter: "formatPrice", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "last", components: [
                {classes: "header"}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", formatter: "formatLineNumber"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.orderDate"},
                {kind: "XV.ListAttr", attr: "scheduleDate"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantity"},
                {kind: "XV.ListAttr", attr: "quantityUnit.name"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantityShipped"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "shipBalance", classes: "bold"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "price", formatter: "formatPrice"},
                {kind: "XV.ListAttr", attr: "priceUnit.name"}
              ]},
              {kind: "XV.ListColumn", components: [
                {kind: "XV.ListAttr", attr: "extendedPrice", formatter: "formatPrice", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatPrice: function (value, view, model) {
        var currency = model ? model.getValue("salesOrder.currency") : false,
          scale = XT.locale.salesPriceScale;
        return currency ? currency.format(value, scale) : "";
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subnumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      }
    });

    // ..........................................................
    // ENTER RECEIPT
    //

    enyo.kind({
      name: "XV.EnterReceiptList",
      kind: "XV.List",
      label: "_enterReceipt".loc(),
      collection: "XM.PurchaseOrderLineCollection",
      parameterWidget: "XV.EnterReceiptParameters",
      query: {orderBy: [
        {attribute: "lineNumber"}
      ]},
      showDeleteAction: false,
      actions: [
        {name: "enterReceipt", prerequisite: "canEnterReceipt",
          method: "enterReceipt", notify: false, isViewMethod: true}
      ],
      toggleSelected: true,
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
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "ordered",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "received",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "toReceive",
                formatter: "formatQuantity", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "dueDate",
                style: "text-align: right"}
            ]}
          ]}
        ]}
      ],
      formatDueDate: function (value, view) {
        var today = new Date(),
          isLate = XT.date.compareDate(value, today) < 1;
        view.addRemoveClass("error", isLate);
        return value;
      },
      formatQuantity: function (value) {
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      enterReceipt: function (inEvent) {
        var model = inEvent.model;

        this.doWorkspace({
          workspace: "XV.EnterReceiptWorkspace",
          id: model.id,
          allowNew: false
        });
      }
    });

    XV.registerModelList("XM.PurchaseOrderRelation", "XV.PurchaseOrderLine");

    // ..........................................................
    // INVENTORY HISTORY REPORT
    //

    enyo.kind({
      name: "XV.InventoryHistoryList",
      kind: "XV.List",
      label: "_history".loc(),
      collection: "XM.InventoryHistoryCollection",
      canAddNew: false,
      query: {orderBy: [
        {attribute: "transactionDate", descending: true},
        {attribute: "uuid"}
      ]},
      parameterWidget: "XV.InventoryHistoryListParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "transactionDate"},
                {kind: "XV.ListAttr", attr: "transactionDate",
                  formatter: "formatTime", classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "transactionType",
                formatter: "formatTransactionType"},
              {kind: "XV.ListAttr", attr: "itemSite.site.code"}
            ]},
            {kind: "XV.ListColumn", classes: "second left", components: [
              {kind: "XV.ListAttr", attr: "itemSite.item.number"},
              {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "orderType",
                formatter: "formatOrderType"},
              {kind: "XV.ListAttr", attr: "orderNumber"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "unit"},
              {kind: "XV.ListAttr", attr: "quantity",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "valueBefore",
                formatter: "formatMoney"},
              {kind: "XV.ListAttr", attr: "quantityBefore",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "valueAfter",
                formatter: "formatMoney"},
              {kind: "XV.ListAttr", attr: "quantityAfter",
                formatter: "formatQuantity"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "costMethod",
                formatter: "formatCostMethod"},
              {kind: "XV.ListAttr", attr: "user.username"}
            ]}
          ]}
        ]},
      ],
      formatCostMethod: function (value) {
        switch (value)
        {
        case XM.ItemSite.STANDARD_COST:
          return "_standard".loc();
        case XM.ItemSite.AVERAGE_COST:
          return "_average".loc();
        case XM.ItemSite.JOB_COST:
          return "_job".loc();
        case XM.ItemSite.NO_COST:
          return "_None".loc();
        default:
          return value;
        }
      },
      formatTime: function (value) {
        return Globalize.format(value, "t");
      },
      formatMoney: function (value, view) {
        view.addRemoveClass("error", value < 0);
        var scale = XT.locale.currencyScale;
        return Globalize.format(value, "c" + scale);
      },
      formatOrderType: function (value) {
        switch (value)
        {
        case "SO":
          return "_salesOrder".loc();
        case "PO":
          return "_purchaseOrder".loc();
        case "WO":
          return "_workOrder".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TO":
          return "_transferOrder".loc();
        case "Misc":
          return "_miscellaneous".loc();
        default:
          return value;
        }
      },
      formatQuantity: function (value, view) {
        view.addRemoveClass("error", value < 0);
        var scale = XT.locale.quantityScale;
        return Globalize.format(value, "n" + scale);
      },
      formatTransactionType: function (value) {
        switch (value)
        {
        case "SH":
          return "_issueToShipping".loc();
        case "RS":
          return "_returnFromShipping".loc();
        case "IM":
          return "_issueMaterial".loc();
        case "CC":
          return "_cycleCount".loc();
        case "RP":
          return "_receivePurchaseOrder".loc();
        case "RM":
          return "_receiveMaterial".loc();
        case "EX":
          return "_expense".loc();
        case "AD":
          return "_adjustment".loc();
        case "RX":
          return "_materialReceipt".loc();
        case "TW":
          return "_siteTransfer".loc();
        case "RB":
          return "_receiveBreeder".loc();
        case "IB":
          return "_issueBreeder".loc();
        case "RL":
          return "_relocate".loc();
        case "RR":
          return "_receiveReturn".loc();
        default:
          return value;
        }
      }
    });

    XV.registerModelList("XM.InventoryHistory", "XV.InventoryHistoryList");

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingList",
      kind: "XV.List",
      label: "_issueToShipping".loc(),
      collection: "XM.IssueToShippingCollection",
      parameterWidget: "XV.IssueToShippingParameters",
      multiSelect: true,
      query: {orderBy: [
        {attribute: "lineNumber"},
        {attribute: "subNumber"}
      ]},
      showDeleteAction: false,
      actions: [
        {name: "issueStock", prerequisite: "canIssueStock",
          method: "issueStock", notify: false, isViewMethod: true},
        {name: "issueLine", prerequisite: "canIssueStock",
          method: "issueLine", notify: false, isViewMethod: true},
        {name: "returnLine", prerequisite: "canReturnStock",
          method: "returnStock", notify: false, isViewMethod: true}
      ],
      toggleSelected: true,
      published: {
        shipment: null
      },
      events: {
        onProcessingChanged: "",
        onShipmentChanged: ""
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
            XM.Inventory.issueToShipping(data, dispOptions);

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
        this.issue(models, true);
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
      },
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

    // ..........................................................
    // LOCATION
    //

    enyo.kind({
      name: "XV.LocationList",
      kind: "XV.List",
      label: "_locations".loc(),
      collection: "XM.LocationCollection",
      query: {orderBy: [
        {attribute: "description"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short", components: [
              {kind: "XV.ListAttr", attr: "format", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "site.code"}
            ]},
            {kind: "XV.ListColumn", classes: "second left", components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "isRestricted"}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "isNetable"}
            ]}
          ]}
        ]}
      ]

    });

    XV.registerModelList("XM.Location", "XV.LocationList");
    XV.registerModelList("XM.LocationItem", "XV.LocationList");

    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentList",
      kind: "XV.List",
      label: "_shipments".loc(),
      collection: "XM.ShipmentListItemCollection",
      canAddNew: false,
      actions: [
        {name: "shipShipment", method: "shipShipment",
          isViewMethod: true, notify: false,
          prerequisite: "canShipShipment"},
        {name: "recallShipment", method: "doRecallShipment",
          prerequisite: "canRecallShipment",
          notifyMessage: "_recallShipment?".loc()}
      ],
      query: {orderBy: [
        {attribute: "number", descending: true, numeric: true}
      ]},
      parameterWidget: "XV.ShipmentListItemParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", formatter: "formatStatus",
                  style: "padding-left: 24px"},
                {kind: "XV.ListAttr", attr: "shipDate", classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "order.number"},
                {kind: "XV.ListAttr", attr: "shipVia",
                  classes: "right", placeholder: "_noShipVia".loc()}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "order.shiptoName", classes: "italic"},
              {kind: "XV.ListAttr", formatter: "formatShipto"}
            ]}
          ]}
        ]}
      ],
      formatStatus: function (value, view, model) {
        if (model.get("isInvoiced")) {
          return "_invoiced".loc();
        } else if (model.get("isShipped")) {
          return "_shipped".loc();
        }
        return "_open".loc();
      },
      formatShipto: function (value, view, model) {
        var order = model.get("order"),
          city = order && order.get("shiptoCity"),
          state = order && order.get("shiptoState"),
          country = order && order.get("shiptoCountry");
        return XM.Address.formatShort(city, state, country);
      },
      shipShipment: function (inEvent) {
        var index = inEvent.index,
          shipment = this.getValue().at(index),
          that = this,
          callback = function (resp) {
            var options = {
              success: function () {
                // Re-render the row if showing shipped, otherwise remove it
                var query = that.getQuery(),
                  param,
                  collection,
                  model;
                param = _.findWhere(query.parameters, {attribute: "isShipped"});
                if (param) {
                  collection = that.getValue();
                  model = collection.at(index);
                  collection.remove(model);
                  that.fetched();
                } else {
                  that.renderRow(index);
                }
              }
            };
            // Refresh row if shipped
            if (resp) { shipment.fetch(options); }
          };
        this.doWorkspace({
          workspace: "XV.ShipShipmentWorkspace",
          id: shipment.id,
          callback: callback
        });
      }
    });

    XV.registerModelList("XM.Shipment", "XV.ShipmentList");

  };
}());
