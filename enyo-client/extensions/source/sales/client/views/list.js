/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  enyo.kind({
    name: "XV.SalesHistoryList",
    kind: "XV.List",
    label: "_salesHistory".loc(),
    collection: "XM.SalesHistoryCollection",
    parameterWidget: "XV.SalesHistoryListParameters",
    query: {orderBy: [
      {attribute: 'id'}
    ]},
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "FittableColumns", components: [
          {kind: "XV.ListColumn", classes: "short",
            components: [
            {kind: "XV.ListAttr", attr: "customer.number", isKey: true},
            {kind: "XV.ListAttr", attr: "salesRep.name"}
          ]},
          {kind: "XV.ListColumn", classes: "last", fit: true, components: [
            {kind: "XV.ListAttr", attr: "orderNumber"}
          ]}
        ]}
      ]}
    ]
  });

  XV.registerModelList("XM.SalesHistory", "XV.SalesHistoryList");

}());
