XT.extensions.billing.initListRelationsEditors = function () {

  /**
   * @class CashReceiptPaymentEditor
   */
  enyo.kind({
    name: 'XV.SalesOrderPaymentBox',
    kind: 'XV.RelationsEditor',
    controlClasses: 'in-panel',
    published: {
      salesOrder: null
    },
    events: {
      onSalesOrderPaymentChange: ''
    },
    components: [
      {kind: 'onyx.GroupboxHeader', content: '_payment'.loc()},
      {kind: 'XV.InputWidget', attr: 'number'},
      {kind: 'XV.DateWidget', attr: 'documentDate'},
      {kind: 'XV.BankAccountWidget', attr: 'bankAccount'},
      {kind: 'XV.FundsTypePicker', attr: 'fundsType', onSelect: 'fundsTypeSelected'},
      {kind: 'XV.MoneyWidget', name: 'payment', label: '_payment'.loc(),
          attr: { localValue: 'amount', currency: 'currency' }},
      {kind: 'XV.MoneyWidget', label: '_balance'.loc(),
          attr: { localValue: 'balance', currency: 'currency' }},
      {kind: "FittableColumns", components: [
        //{kind: 'onyx.Button', content: '_clear'.loc(), ontap: 'handleClearTap'},
        // XXX #refactor out style attr
        {kind: 'onyx.Button', name: 'postButton', content: '_postCashPayment'.loc(), classes: 'onyx-blue',
          fit: true, ontap: 'handlePayment', disabled: true}
      ]}
    ],
    valueChanged: function () {
      this.inherited(arguments);
      /*
      this.value.on('status:READY_CLEAN status:READY_NEW', function (payment, status, options) {
        console.log(payment.relations);
      });
      console.log(this.value.relations);
      */
      //this.doSalesOrderPaymentChange();
    },
    salesOrderChanged: function () {
      var that = this,
        onReady = function (order) {
          console.log(order);
          that.$.postButton.setDisabled(false);
          that.setValue(new XM.CashReceipt({
            balance: order.get('balance'),
            amount: order.get('balance'),
            customer: order.get('customer'),
            documentDate: new Date(),
            applicationDate: order.get('orderDate'),
            distributionDate: order.get('orderDate'),
            currency: order.get('currency'),
            isPosted: true
          }, { isNew: true }));
        };

      if (this.salesOrder.getStatus() === XM.Model.READY_CLEAN) {
        onReady(this.salesOrder);
      }
      this.salesOrder.on('status:READY_CLEAN', onReady);
    },
    handlePayment: function (inSender, inEvent) {
      var payment = this.value;
      this.log(payment);
      this.log(payment.validate(payment.attributes));

      if (payment && payment.isNew() && payment.isValid()) {
        this.salesOrder.addPayment(payment);
      }

      return true;
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
