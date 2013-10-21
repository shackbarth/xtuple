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
};
