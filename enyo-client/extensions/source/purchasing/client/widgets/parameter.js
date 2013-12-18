/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.purchasing.initParameters = function () {
    var extensions;

    // ..........................................................
    // ACTIVITY
    //

    XV.ActivityListParameters.prototype.activityTypes.purchasing = [
      {type: "PurchaseOrder", label: "_orders".loc()},
      {type: "PurchaseOrderWorkflow", label: "_workflow".loc()}
    ];

    // ..........................................................
    // PURCHASE ORDER LIST
    //

    enyo.kind({
      name: "XV.PurchaseOrderListParameters",
      kind: "XV.ParameterWidget",
      characteristicsRole: 'isPurchaseOrders',
      defaultParameters: function () {
        return {
          user: XM.currentUser
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_purchaseOrder".loc()},
        {name: "showClosed", label: "_showClosed".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: 'C'
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "vendor", label: "_vendor".loc(), attr: "vendor", defaultKind: "XV.VendorWidget"},
        {kind: "onyx.GroupboxHeader", content: "_orderDate".loc()},
        {name: "fromOrderDate", label: "_fromDate".loc(), attr: "orderDate", operator: ">=",
          filterLabel: "_from".loc() + " " + "_orderDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "toDueDate", label: "_toDate".loc(), attr: "orderDate", operator: "<=",
          filterLabel: "_to".loc() + " " + "_orderDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"}
      ]
    });
  };

}());
