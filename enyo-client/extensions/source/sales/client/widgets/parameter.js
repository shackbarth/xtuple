/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.sales.initParameters = function () {
    // ..........................................................
    // SALES HISTORY
    //

    enyo.kind({
      name: "XV.SalesHistoryListParameters",
      kind: "XV.ParameterWidget",
      components: [
        {kind: "onyx.GroupboxHeader", content: "_salesHistory".loc()},
        {name: "customer", attr: "customer", label: "_customer".loc(), defaultKind: "XV.CustomerProspectWidget"},
        {name: "salesRep", attr: "salesRep", label: "_salesRep".loc(), defaultKind: "XV.SalesRepPicker"},
      ]
    });
  };

}());
