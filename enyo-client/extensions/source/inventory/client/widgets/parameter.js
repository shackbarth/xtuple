/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.inventory.initParameters = function () {

    // ..........................................................
    // INVENTORY HISTORY
    //

    enyo.kind({
      name: "XV.InventoryHistoryListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_dateRange".loc()},
        //TODO are dates working?
        {name: "transactionFromDate", label: "_fromDate".loc(),
          filterLabel: "_transactionDate".loc() + " " + "_fromDate".loc(),
          attr: "transactionDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "transactionToDate", label: "_toDate".loc(),
          filterLabel: "_transactionDate".loc() + " " + "_toDate".loc(),
          attr: "transactionDate", operator: "<=",
          defaultKind: "XV.DateWidget"},
        {kind: "onyx.GroupboxHeader", content: "_plannerCode".loc()},
        {name: "plannerCode", label: "_plannerCode".loc(), attr: "itemSite.plannerCode",
          defaultKind: "XV.PlannerCodePicker"},
        {name: "plannerCodePattern", label: "_plannerCode".loc() + " " + "_pattern".loc(), attr: "itemSite.plannerCode"},
        {kind: "onyx.GroupboxHeader", content: "_classCode".loc()},
        {name: "classCode", label: "_classCode".loc(), attr: "itemSite.item.classCode",
          defaultKind: "XV.ClassCodePicker"},
        {name: "classCodePattern", label: "_classCode".loc() + " " + "_pattern".loc(), attr: "itemSite.item.classCode"},
        {kind: "onyx.GroupboxHeader", content: "_item".loc()},
        {name: "itemNumber", label: "_number".loc(), attr: "itemSite.item.number"},
        {name: "itemDescription", label: "_description".loc(), attr: ["itemSite.item.description1", "itemSite.item.description2"]},
        /*TODO get item groups working - orms, picker
        {kind: "onyx.GroupboxHeader", content: "_itemGroup".loc()},
        {name: "itemGroup", label: "_equals".loc(), attr: "itemSite.item.itemGroups",
          defaultKind: "XV.ItemGroupPicker"},
        {name: "itemGroupPattern", label: "_itemGroup".loc() + " " + "_pattern".loc(), attr: "itemSite.item.itemGroups"},
        {kind: "onyx.GroupboxHeader", content: "_orderNumber".loc()}, */
        {name: "orderNumberPattern", label: "_orderNumber".loc(), attr: "orderNumber"},
        {kind: "onyx.GroupboxHeader", content: "_costCategory".loc()},
        {name: "costCategory", label: "_equals".loc(), attr: "itemSite.costCategory",
          defaultKind: "XV.CostCategoryPicker"},
        {name: "costCategoryPattern", label: "_costCategory".loc() + " " + "_pattern".loc(), attr: "itemSite.costCategory"},
        //TODO SALES ORDER
        //TODO TRANSACTION TYPE  
        {kind: "onyx.GroupboxHeader", content: "_site".loc()},
        {name: "site", label: "_site".loc(), attr: "itemSite.site.code", defaultKind: "XV.SitePicker"},
      ]
    });

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_order".loc(),
          defaultKind: "XV.OpenSalesOrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "order",
              operator: "=",
              value: value
            };
          } else {
            param = {
              attribute: "lineNumber",
              operator: "=",
              value: -1
            };
          }

          return param;
        }},
        {name: "shipment", label: "_shipment".loc(), defaultKind: "XV.ShipmentWidget"}
      ],
      create: function () {
        this.inherited(arguments);
        this.$.transactionDate.setValue(new Date());
        this.$.shipment.$.input.setDisabled(true);
      }
    });

    // ..........................................................
    // ENTER RECEIPT
    //

    enyo.kind({
      name: "XV.EnterReceiptParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_enterReceipt".loc()},
        {name: "purchaseOrder", attr: "purchaseOrder", label: "_purchaseOrder".loc(), defaultKind: "XV.PurchaseOrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "purchaseOrder",
              operator: "=",
              value: value
            };
          } else {
            param = {
              attribute: "lineNumber",
              operator: "=",
              value: -1
            };
          }

          return param;
        }}
      ]
    });

    // ..........................................................
    // SHIPMENT LIST
    //

    enyo.kind({
      name: "XV.ShipmentListItemParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_shipments".loc()},
        {name: "isShipped", attr: "isShipped", label: "_showShipped".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: false
              };
            }
            return param;
          }
        },
        {name: "isInvoiced", attr: "isInvoiced", label: "_showInvoiced".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: "=",
                value: false
              };
            }
            return param;
          }
        },
        {name: "orderNumber", label: "_orderNumber".loc(), attr: "order.number"},
        {name: "customer", attr: "order.customer.name", label: "_customer".loc(), defaultKind: "XV.CustomerProspectWidget"},
        {name: "shipVia", attr: "shipVia", label: "_shipVia".loc(), defaultKind: "XV.ShipViaPicker"},
        {kind: "onyx.GroupboxHeader", content: "_shipped".loc()},
        {name: "shippedFromDate", label: "_fromDate".loc(),
          filterLabel: "_shipDate".loc() + " " + "_fromDate".loc(),
          attr: "shipDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "shippedToDate", label: "_toDate".loc(),
          filterLabel: "_shipDate".loc() + " " + "_toDate".loc(),
          attr: "shipDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
      ]
    });

  };

}());
