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
      nameAttribute: 'value',
      label: '_fundsType'.loc(),
      showNone: false,
      published: {
        allowCreditCards: false
      },

      /**
       * @override
       * @see XV.PickerWidget#filter
       */
      filter: function (models, options) {
        return _.filter(models, function (model) {
          return this.allowCreditCards || !model.isCreditCard();
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
      nameAttribute: 'key',
      label: '_applyOption'.loc(),
      showNone: false
    });
  };

}());
