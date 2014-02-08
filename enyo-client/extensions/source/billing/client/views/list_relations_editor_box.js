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
        // XXX #refactor out style attr
        {kind: 'onyx.Button', name: 'postButton', content: '_postCashPayment'.loc(), classes: 'onyx-blue',
          fit: true, ontap: 'validatePayment', disabled: true}
      ]}
    ],
    valueChanged: function () {
      // XXX if I could inherit CashReceipt, this logic would go in that submodel.
      // Will this be a problem if I try to then open this cashreceipt in another
      // workspace?
      this.value.off('change:amount');
      this.inherited(arguments);
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

      // XXX I don't know if this level of safety is necessary
      if (this.salesOrder.getStatus() === XM.Model.READY_CLEAN) {
        onReady(this.salesOrder);
      }
      if (this.salesOrder.getStatus() === XM.Model.READY_DIRTY) {
        onDirty(this.salesOrder);
      }
      this.salesOrder.once('status:READY_CLEAN', onReady);
      this.salesOrder.once('status:READY_DIRTY', onDirty);
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
    validatePayment: function (inSender, inEvent) {
      var that = this,
        payment = that.value;

      if (payment.get('amount') > payment.get('balance')) {
        that.doNotify({
          type: XM.Model.YES_NO_CANCEL,
          message: '_salesOrderPaymentOverapplicationWarn'.loc(),
          // TODO #refactor define separate callbacks for each yes/no/cancel selection
          callback: function (result) {
            if (result.answer === true) {
              that.addPayment();
            }
          }
        });
      }
    },
    addPayment: function (inSender, inEvent) {
      var that = this,
        payment = that.value;

      this.salesOrder.once('payment:success', function () {
        // TODO probably want to change this to a growl-type notification
        that.doNotify({
          type: XM.Model.NOTICE,
          message: '_salesOrderPaymentSuccess'.loc(),
          callback: function () {
            that.doPaymentPosted();

            // XXX 123 because there's no combination of backbone status handlers I've
            // tried that seems to listen for when the salesOrder is clean and
            // contains the updated values effected by cashreceipt posting
            setTimeout(function () {
              that.newItem();
            }, 2000);
          }
        });
      });
      this.salesOrder.once('payment:error', function (error) {
        that.doNotify({
          type: XM.Model.WARNING,
          message: '_salesOrderPaymentFailure'.loc()
        });
        // XXX bug? 456
        // if I save, and then change a value in the workspace, then re-call save,
        // it tries to validate against the old value, not the value that is currently
        // in the editor input field. workaround: clear editor on error
        // edit: maybe related to 123 above?
        that.newItem();
      });

      if (!payment || !payment.isValid()) {
        // TODO piggyback off of the existing invalid handler, wherever it is
        that.doNotify({
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
