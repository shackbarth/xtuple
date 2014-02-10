/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, enyo:true, _:true*/

(function () {

  XT.extensions.billing.initPickers = function () {

    // ..........................................................
    // RECEIVABLE TYPES
    //

    enyo.kind({
      name: "XV.ReceivableTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.receivableTypes",
      showNone: false
    });

    /**
     * @class XV.FundsTypePicker
     * @extends XV.PickerWidget
     */
    enyo.kind({
      name: 'XV.FundsTypePicker',
      kind: 'XV.PickerWidget',
      collection: 'XM.fundsTypes',
      nameAttribute: 'label',
      label: '_fundsType'.loc(),
      showNone: false,
      published: {
        allowCreditCards: false
      },

      /**
       * @override
       * @see XV.FundsTypePicker#filter
       *
       * Decide based on session privileges whether to show credit card
       * options
       */
      create: function () {
        this.setAllowCreditCards(XT.session.privileges.get('ProcessCreditCards'));
        this.inherited(arguments);
      },

      /**
       * @override
       * @see XV.PickerWidget#filter
       */
      filter: function (models, options) {
        var that = this;

        return _.filter(models, function (model) {
          return that.allowCreditCards || !model.isCreditCard();
        });
      }
    });

    /**
     * @class XV.CashReceiptApplyOptionsPicker
     * @extends XV.PickerWidget
     */
    enyo.kind({
      name: 'XV.CashReceiptApplyOptionsPicker',
      kind: 'XV.PickerWidget',
      collection: 'XM.cashReceiptApplyOptions',
      nameAttribute: 'label',
      label: '_applyBalanceAs'.loc(),
      showNone: false,

      /**
       * @override
       * Decide based on session settings whether to display this widget
       */
      create: function () {
        this.inherited(arguments);
        this.setShowing(XT.session.settings.get('EnableCustomerDeposits'));
      }
    });
  };

}());
