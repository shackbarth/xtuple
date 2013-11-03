XT.extensions.billing.initLists = function () {

  /**
   * @class XV.SalesCategory
   * @see XM.SalesCategoryCollection
   */
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

  /**
   * @class XV.CashReceiptList
   * @see XM.CashReceiptListItemCollection
   */
  enyo.kind({
    name: 'XV.CashReceiptList',
    kind: 'XV.List',
    view: 'XM.CashReceiptView',
    label: '_cashReceipts'.loc(),
    collection: 'XM.CashReceiptListItemCollection',
    components: [
      {kind: 'XV.ListItemDecorator', components: [
        {name: 'listItem', kind: 'XV.CashReceiptListItem'}
      ]}
    ]
  });

  XV.registerModelList('XM.CashReceiptListItem', 'XV.CashReceiptListItemCollection');
};
