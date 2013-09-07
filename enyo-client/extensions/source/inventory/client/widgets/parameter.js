/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, enyo:true*/

(function () {

  XT.extensions.inventory.initParameters = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_issueToShipping".loc()},
        {name: "order", attr: "order", label: "_order".loc(), defaultKind: "XV.SalesOrderWidget",
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
        }}
      ]
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
        {name: "isShipped", attr: "isShipped", label: "_showUnshipped".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: "=",
                value: true
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