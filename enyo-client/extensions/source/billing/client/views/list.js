/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true*/

XT.extensions.billing.initLists = function () {

  enyo.kind({
    name: 'XV.SalesCategoryList',
    kind: 'XV.List',
    view: 'XM.SalesCategoryView',
    label: '_salesCategories'.loc(),
    collection: 'XM.SalesCategoryCollection',

    components: [
      {kind: 'XV.ListItemDecorator', components: [
        {name: 'listItem', kind: 'XV.SalesCategoryListItem'}
      ]}
    ]

  });

  XV.registerModelList('XM.SalesCategory', 'XV.SalesCategoryList');

  // ..........................................................
  // RECEIVABLES
  //

  enyo.kind({
    name: "XV.ReceivableList",
    kind: "XV.List",
    label: "_receivables".loc(),
    collection: "XM.ReceivableListItemCollection",
    components: [
      {kind: "XV.ListItem", components: [
        {kind: "XV.ListColumn", classes: "last", components: [
          {kind: "XV.ListAttr", attr: "documentNumber"}
        ]}
      ]}
    ]
  });

  XV.registerModelList('XM.Receivable', 'XV.ReceivableList');
};
