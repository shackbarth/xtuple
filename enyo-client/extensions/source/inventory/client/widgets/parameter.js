/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

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
              operator: '=',
              value: value
            };
          } else {
            param = {
              attribute: "lineNumber",
              operator: '=',
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
              operator: '=',
              value: value
            };
          } else {
            param = {
              attribute: "lineNumber",
              operator: '=',
              value: -1
            };
          }

          return param;
        }}
      ]
    });

    // ..........................................................
    // PURCHASE ORDER LIST
    //

    enyo.kind({
      name: "XV.PurchaseOrderListItemParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_purchaseOrders".loc()},
        {name: "unReleased", attr: "status", label: "_unReleased".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: "U"
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
        {name: "vendor", attr: "vendor.number", label: "_vendor".loc(), defaultKind: "XV.VendorWidget"},
        {name: "vendorType", attr: "vendor.vendorType.code", label: "_vendorType".loc(), defaultKind: "XV.VendorTypePicker"},
        {kind: "onyx.GroupboxHeader", content: "_purchaseOrderDate".loc()},
        {name: "fromDate", label: "_fromDate".loc(),
          filterLabel: "_date".loc() + " " + "_fromDate".loc(),
          attr: "orderDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "toDate", label: "_toDate".loc(),
          filterLabel: "_date".loc() + " " + "_toDate".loc(),
          attr: "orderDate", operator: "<=",
          defaultKind: "XV.DateWidget"}
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
                operator: '=',
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
                operator: '=',
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

    // ..........................................................
    // VENDOR
    //

    enyo.kind({
      name: "XV.VendorListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_vendor".loc()},
        {name: "isActive", attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: true
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "name", label: "_name".loc(), attr: "name"},
        {name: "vendorType", attr: "vendorType.code", label: "_vendorType".loc(), defaultKind: "XV.VendorTypePicker"},
        {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
        {name: "primaryEmail", label: "_primaryEmail".loc(), attr: "contact1.primaryEmail"},
        {name: "phone", label: "_phone".loc(), attr: ["contact1.phone", "contact1.alternate", "contact1.fax"]},
        {kind: "onyx.GroupboxHeader", content: "_address".loc()},
        {name: "street", label: "_street".loc(), attr: ["address.line1", "address.line2", "address.line3"]},
        {name: "city", label: "_city".loc(), attr: "address.city"},
        {name: "state", label: "_state".loc(), attr: "address.state"},
        {name: "postalCode", label: "_postalCode".loc(), attr: "address.postalCode"},
        {name: "country", label: "_country".loc(), attr: "address.country"}
      ]
    });

  };

}());
