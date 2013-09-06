/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true*/

(function () {

  XT.extensions.standard.initParameters = function () {

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingMultiParameters",
      kind: "XV.IssueToShippingParameters",
      create: function () {
        this.inherited(arguments);
        this.$.order.setDefaultKind("XV.OrderWidget");
      }
    });

  };

}());
