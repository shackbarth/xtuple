/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerGroupCustomerBox",
    kind: "XV.ListRelationsBox",
    title: "_customers".loc(),
    parentKey: "customerGroup",
    listRelations: "XV.CustomerGroupCustomerListRelations"
  });

}());