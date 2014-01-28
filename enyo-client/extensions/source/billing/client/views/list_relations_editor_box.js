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
      onPaymentPosted: ''
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
      this.clear();
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
          that.$.postButton.setDisabled(false);
          that.newItem();
        },
        onDirty = function (order) {
          that.$.postButton.setDisabled(true);
        };

      if (this.salesOrder.getStatus() === XM.Model.READY_CLEAN) {
        onReady(this.salesOrder);
      }
      if (this.salesOrder.getStatus() === XM.Model.READY_DIRTY) {
        onDirty(this.salesOrder);
      }
      this.salesOrder.on('status:READY_CLEAN', onReady);
      this.salesOrder.on('status:READY_DIRTY', onDirty);
    },
    /**
     * @override
     */
    newItem: function () {
      var order = this.salesOrder;

      this.setValue(new XM.CashReceipt({
        balance: order.get('balance'),
        amount: order.get('balance'),
        customer: order.get('customer'),
        documentDate: new Date(),
        applicationDate: order.get('orderDate'),
        distributionDate: order.get('orderDate'),
        currency: order.get('currency')
      }, { isNew: true }));
    },
    handlePayment: function (inSender, inEvent) {
      var editor = this,
        payment = editor.value;

      this.salesOrder.once('payment:success', function () {
        // TODO probably want to change this to a growl-type notification
        editor.doNotify({
          type: XM.Model.NOTICE,
          message: '_salesOrderPaymentSuccess'.loc(),
          callback: function () {
            editor.doPaymentPosted();
          }
        });
      });
      this.salesOrder.once('payment:error', function (error) {
        editor.doNotify({
          type: XM.Model.WARNING,
          message: '_salesOrderPaymentFailure'.loc()
        });
      });

      if (!payment || !payment.isNew() || !payment.isValid()) {
        // TODO piggyback off of the existing invalid handler, wherever it is
        editor.doNotify({
          type: XM.Model.NOTICE,
          message: 'Please correct errors in the Payment editor'
        });
        return true;
      }

      this.salesOrder.addPayment(payment);
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
