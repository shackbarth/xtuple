XT.extensions.billing.initRelationWidgets = function () {

  enyo.kind({
    name: 'XV.CashReceiptLineWidget',
    kind: 'XV.RelationWidget',
    collection: 'XM.CashReceiptLineListItemCollection',
    list: 'XV.CashReceiptLineList'
  });

};
