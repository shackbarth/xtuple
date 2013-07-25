/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.inventory.initParameters = function () {

    // ..........................................................
    // SALES HISTORY
    //

    enyo.kind({
      name: "XV.IssueToShippingParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_issueToShipping".loc()},
        {name: "order", attr: "order", label: "_order".loc(), defaultKind: "XV.SalesOrderWidget"}
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
        {name: "open", attr: "status", label: "_open".loc(), defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '=',
                value: "O"
              };
            }
            return param;
          }
        },
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
        {name: "vendor", attr: "vendor.number", label: "_vendor".loc(), defaultKind: "XV.VendorWidget"},
        {name: "fromDate", label: "_fromDate".loc(),
          filterLabel: "_date".loc() + " " + "_fromDate".loc(),
          attr: "orderDate", operator: ">=",
          defaultKind: "XV.DateWidget"},
        {name: "toDate", label: "_toDatete".loc(),
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
    //  characteristicsRole: 'isAccounts',
      components: [
        {kind: "onyx.GroupboxHeader", content: "_shipments".loc()},
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
