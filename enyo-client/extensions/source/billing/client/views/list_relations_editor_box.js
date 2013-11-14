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

  // ..........................................................
  // RECEIVABLE TAXES
  //
  enyo.kind({
    name: "XV.ReceivableTaxEditor",
    kind: "XV.RelationsEditor",
    components: [
      {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
        classes: "in-panel", components: [
        {kind: "XV.TaxCodePicker", attr: "taxCode"},
        {kind: "XV.MoneyWidget", attr: {localValue: "taxAmount"},
          label: "_amount".loc(), currencyShowing: false}
      ]}
    ]
  });

};
