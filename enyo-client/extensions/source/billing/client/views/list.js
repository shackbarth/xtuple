/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true*/

XT.extensions.billing.initLists = function () {

  enyo.kind({
    name: 'XV.SalesCategoryList',
    kind: 'XV.List',
    label: '_salesCategories'.loc(),
    collection: 'XM.SalesCategoryCollection',
    query: {
      orderBy: [
        {attribute: 'isActive', descending: true},
        {attribute: 'name'}
      ]
    },
    actions: [{
      name: 'deactivate',
      prerequisite: 'canDeactivate',
      method: 'deactivate'
    }],
    components: [
      {kind: 'XV.SalesCategoryListItem', name: 'listItem', decorated: true}
    ]
  });

  XV.registerModelList('XM.SalesCategory', 'XV.SalesCategoryList');
};

