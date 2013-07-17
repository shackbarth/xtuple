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
  };

}());
