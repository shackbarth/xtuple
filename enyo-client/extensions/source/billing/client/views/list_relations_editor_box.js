XT.extensions.billing.initListRelationsEditors = function () {

  /**
   * @class CashReceiptPaymentEditor
   */
  enyo.kind({
    name: 'XV.CashAllocationEditor',
    kind: 'XV.RelationsEditor',
    controlClasses: 'in-panel',
    components: [
      {kind: 'XV.InputWidget', attr: 'number'},
      {kind: 'XV.DateWidget', attr: 'documentDate'},
      {kind: 'XV.BankAccountWidget', attr: 'bankAccount'},
      {kind: 'XV.FundsTypePicker', attr: 'fundsType', onSelect: 'fundsTypeSelected'},
      {kind: 'XV.CashReceiptApplyOptionsPicker', attr: 'useCustomerDeposit',
          onSelect: 'applyOptionSelected'},
      {tag: 'hr'},
      {kind: 'XV.MoneyWidget', label: '_amount'.loc(),
          attr: { localValue: 'amount', currency: 'currency' }}
    ],
    valueChanged: function () {
      this.inherited(arguments);
      this.bubbleUp('onCashAllocationChange');
    }
  });

  /**
   * @class CashReceiptLineEditor
   */
  enyo.kind({
    name: 'XV.CashReceiptLineEditor',
    kind: 'XV.RelationsEditor',
    style: 'width: 100%',
    components: [
      {kind: 'XV.ScrollableGroupbox', fit: true, classes: 'in-panel', components: [
        {kind: 'XV.InputWidget', attr: 'cashReceiptReceivable.receivable.documentNumber',
            label: '_documentNumber'.loc()},
        {kind: "XV.InputWidget", attr: "cashReceiptReceivable.receivable.orderNumber",
            label: '_orderNumber'.loc()},
        {kind: "XV.DateWidget", attr: "cashReceiptReceivable.receivable.dueDate",
            label: '_dueDate'.loc()},
        //{kind: 'XV.CheckboxWidget', attr: 'isApplied', label: '_applied'.loc()},
        {kind: 'XV.MoneyWidget',
          attr: { localValue: 'amount', currency: 'cashReceipt.currency' },
          label: '_amount'.loc(), disableCurrency: true},
        {kind: 'XV.MoneyWidget',
          attr: { localValue: 'discountAmount', currency: 'cashReceipt.currency' },
          label: '_discount'.loc(), disableCurrency: true}
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
