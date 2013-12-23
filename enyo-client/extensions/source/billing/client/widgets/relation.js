XT.extensions.billing.initRelationWidgets = function () {

  enyo.kind({
    name: 'XV.BankAccountWidget',
    kind: 'XV.RelationWidget',
    collection: 'XM.BankAccountRelationCollection',
    list: 'XV.BankAccountList',
    keyAttribute: 'name'
  });


  enyo.kind({
    name: 'XV.CashReceiptWidget',
    kind: 'XV.RelationWidget',
    collection: 'XM.CashReceiptRelationCollection',
    list: 'XV.CashReceiptList',
    keyAttribute: 'number',
    query: {
      parameters: [
        { attribute: 'isPosted', value: false }
      ]
    }
  });

};
