/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initParameters = function () {

    // ..........................................................
    // ISSUE MATERIAL
    //

    enyo.kind({
      name: "XV.IssueMaterialParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_parameters".loc()},
        {name: "transactionDate", label: "_issueDate".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "order", attr: "order", label: "_workOrder".loc(),
          defaultKind: "XV.OpenWorkOrderWidget",
        getParameter: function () {
          var param,
           value = this.getValue();

          // If no order build a query that returns nothing
          if (value) {
            param = {
              attribute: "order.number",
              operator: "=",
              value: value
            };
          } else {
            param = {
              attribute: "order.number",
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
