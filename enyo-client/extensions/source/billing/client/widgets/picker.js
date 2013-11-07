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

    enyo.kind({
      name: 'XV.FundsTypePicker',
      kind: 'XV.PickerWidget',
      collection: 'XM.fundsTypes',
      nameAttribute: 'key',
      showNone: false
    });

    enyo.kind({
      name: 'XV.CashReceiptApplyOptionsPicker',
      kind: 'XV.PickerWidget',
      collection: 'XM.cashReceiptApplyOptions',
      nameAttribute: 'key',
      showNone: false
    });
  };

}());
