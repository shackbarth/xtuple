XT.extensions.billing.initListRelationsEditors = function () {

  enyo.kind({
    name: 'XV.CashReceiptLineEditor',
    kind: 'XV.RelationsEditor',
    style: 'width: 100%',
    components: [
      {kind: 'XV.ScrollableGroupbox', fit: true, classes: 'in-panel', components: [
        {kind: 'XV.InputWidget', attr: 'receivable.documentNumber', label: '_documentNumber'.loc()},
        {kind: 'XV.CheckboxWidget', attr: 'isApplied', label: '_applied'.loc()},
        {kind: 'XV.MoneyWidget',
          label: '_amount'.loc(),
          attr: { localValue: 'amount', currency: 'cashReceipt.currency' },
          disableCurrency: true
        },
        {kind: 'XV.MoneyWidget',
          label: '_discount'.loc(),
          attr: { localValue: 'discount', currency: 'cashReceipt.currency' },
          disableCurrency: true
        }
      ]}
    ]
  });

};
