/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  // Receivable Types
  var receivableTypeJson = [
    { id: XM.Receivable.INVOICE, name: "_invoice".loc() },
    { id: XM.Receivable.DEBIT_MEMO, name: "_debitMemo".loc() },
    { id: XM.Receivable.CREDIT_MEMO, name: "_creditMemo".loc() },
    { id: XM.Receivable.CUSTOMER_DEPOSIT, name: "_customerDeposit".loc() }
  ];
  XM.ReceivableTypeModel = Backbone.Model.extend({});
  XM.ReceivableTypeCollection = Backbone.Collection.extend({
    model: XM.ReceivableTypeModel
  });
  XM.receivableTypes = new XM.ReceivableTypeCollection();
  for (var i = 0; i < receivableTypeJson.length; i++) {
    var receivableType = new XM.ReceivableTypeModel(receivableTypeJson[i]);
    XM.receivableTypes.add(receivableType);
  }

}());
