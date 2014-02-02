XT.extensions.billing.initRelationWidgets = function () {

  enyo.kind({
    name: 'XV.BankAccountWidget',
    kind: 'XV.RelationWidget',
    collection: 'XM.BankAccountRelationCollection',
    list: 'XV.BankAccountList',
    keyAttribute: 'name',
    nameAttribute: 'description'
  });
};
