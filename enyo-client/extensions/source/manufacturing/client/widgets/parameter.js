/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initParameters = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueMaterialParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_order".loc(),
          defaultKind: "XV.OpenWorkOrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "order.uuid",
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
      ],
      create: function () {
        this.inherited(arguments);
        this.$.transactionDate.setValue(new Date());
        //this.$.shipment.$.input.setDisabled(true);
      }
    });

  };

}());
