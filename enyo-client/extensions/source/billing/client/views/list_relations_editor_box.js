XT.extensions.billing.initListRelationsEditors = function () {

  /**
   * @class CashReceiptAllocationEditor
   */
  enyo.kind({
    name: 'XV.CashReceiptAllocationEditor',
    kind: 'XV.RelationsEditor',
    style: 'width: 100%',
    components: [
      {kind: 'XV.Groupbox', name: 'mainPanel', components: [
        {kind: 'onyx.GroupboxHeader', content: '_overview'.loc()},
        {kind: 'XV.ScrollableGroupbox', name: 'mainGroup',
            classes: 'in-panel', components: [
          {kind: 'XV.InputWidget', attr: 'number'},
          {kind: 'XV.CheckboxWidget', attr: 'isPosted', label: '_posted'.loc()},
          {kind: 'XV.SalesCustomerWidget', attr: 'customer'},
          {kind: 'XV.BankAccountWidget', attr: 'bankAccount'},
          {kind: 'XV.FundsTypePicker', attr: 'fundsType', onSelect: 'fundsTypeSelected'},
          {kind: 'XV.CashReceiptApplyOptionsPicker',
            attr: 'useCustomerDeposit',
            onSelect: 'applyOptionSelected'
          },
          {tag: 'hr'},
          {kind: 'XV.DateWidget', attr: 'documentDate'},
          {kind: 'XV.DateWidget', attr: 'distributionDate'},
          {kind: 'XV.DateWidget', attr: 'applicationDate'},
          {tag: 'hr'},
          {kind: 'XV.MoneyWidget',
            name: 'balance',
            label: '_balance'.loc(),
            attr: { localValue: 'balance', currency: 'currency' },
            disableCurrency: true
          },
          {kind: 'XV.MoneyWidget',
            label: '_amount'.loc(),
            attr: { localValue: 'amount', currency: 'currency' },
            disableCurrency: true
          },
          {kind: 'XV.MoneyWidget',
            label: '_appliedAmount'.loc(),
            attr: { localValue: 'appliedAmount', currency: 'currency' },
            disableCurrency: true
          },
          {kind: 'onyx.GroupboxHeader', content: '_notes'.loc()},
          {kind: 'XV.TextArea', attr: 'notes'},
        ]}
      ]}
    ],
  /*
    components: [
      {kind: 'XV.ScrollableGroupbox', fit: true, classes: 'in-panel', components: [
        {kind: 'XV.CashReceiptWidget', attr: 'cashReceipt'},
        {kind: 'XV.InputWidget', attr: 'receivable.documentNumber',
            label: '_documentNumber'.loc()},
        {kind: "XV.InputWidget", attr: "target.number",
            label: '_order'.loc()},
        {kind: "XV.DateWidget", attr: "receivable.dueDate",
            label: '_dueDate'.loc()},
        {kind: 'XV.MoneyWidget',
          attr: { localValue: 'amount', currency: 'currency' },
          label: '_amount'.loc(), disableCurrency: true},
        {kind: 'XV.MoneyWidget',
          attr: { localValue: 'target.total', currency: 'currency' },
          label: '_total'.loc(), disableCurrency: true}
      ]}
    ],
    */
    valueChanged: function () {
      this.inherited(arguments);
      this.warn(this.value);
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
