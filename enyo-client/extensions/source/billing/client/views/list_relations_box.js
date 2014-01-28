/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initListRelationsBox = function () {

    // ..........................................................
    // RECEIVABLE TAXES
    //

    enyo.kind({
      name: "XV.ReceivableTaxBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_tax".loc(),
      editor: "XV.ReceivableTaxEditor",
      parentKey: "receivable",
      listRelations: "XV.ReceivableTaxListRelations",
      fitButtons: false,
      create: function () {
        this.inherited(arguments);
        this.$.deleteButton.setShowing(false);
      }
    });

    // ..........................................................
    // RECEIVABLE APPLICATIONS
    //

    enyo.kind({
      name: "XV.ReceivableApplicationsListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_applications".loc(),
      parentKey: "receivable",
      listRelations: "XV.ReceivableApplicationListRelations"
    });

    /*
    enyo.kind({
      name: 'XV.SalesOrderPaymentBox',
      kind: 'XV.ListRelationsEditorBox',
      editor: 'XV.SalesOrderPaymentEditor',
      listRelations: 'XV.SalesOrderPaymentList',
      searchList: 'XV.CashReceiptList',
      title: '_payment'.loc(),

      handlers: {
        onSalesOrderPaymentChange: 'handleSalesOrderPaymentChange'
      },

      create: function () {
        this.inherited(arguments);
        this.$.prevButton.setShowing(false);
        this.$.nextButton.setShowing(false);
      },

      // XXX #refactor: distinction between "value" and "controlValue" is confusing
      handleSalesOrderPaymentChange: function () {
        this.inherited(arguments);
        if (!this.$.editor.value) { return; }

        this.warn(this.$.editor.value);
        this.warn(this.$.editor.value.isNew());

        if (this.$.editor.value.isNew()) {
          this.$.doneButton.setContent("_postCashPayment".loc());
          this.$.doneButton.addClass('onyx-blue');
        }
        else {
          this.$.doneButton.setContent("_done".loc());
          this.$.doneButton.removeClass('onyx-blue');
        }

        return true;
      },
      doneItem: function () {
        this.inherited(arguments);
        var cashReceipt = this.$.editor.value;

        if (cashReceipt && cashReceipt.isNew() && cashReceipt.isValid()) {
          //cashReceipt.post('SalesOrder');
        }
        this.warn(cashReceipt);

        return true;
      }
    });
    */

    /**
     * @class XV.CashReceiptApplicationsBox
     * @extends XV.ListRelationsBox
     * @see XV.CashReceiptApplicationsList
     */
    enyo.kind({
      name: 'XV.CashReceiptApplicationsBox',
      kind: 'XV.ListRelationsEditorBox',
      editor: 'XV.CashReceiptLineEditor',
      parentKey: 'cashReceipt',
      listRelations: 'XV.CashReceiptLineList',
      title: '_cashReceiptApplications'.loc()
    });
  };

}());
