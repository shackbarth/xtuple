/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i,
    K;

  // Credit Status
  K = XM.Receivable;
  var receivableTypeJson = [
    { id: K.INVOICE, name: "_invoice".loc() },
    { id: K.DEBIT_MEMO, name: "_debitMemo".loc() },
    { id: K.CREDIT_MEMO, name: "_creditMemo".loc() },
    { id: K.CUSTOMER_DEPOSIT, name: "_customerDeposit".loc() }
  ];
  XM.ReceivableTypeModel = Backbone.Model.extend({});
  XM.ReceivableTypeCollection = Backbone.Collection.extend({
    model: XM.ReceivableTypeModel
  });
  XM.receivableTypes = new XM.ReceivableTypeCollection();
  for (i = 0; i < receivableTypeJson.length; i++) {
    var receivableType = new XM.ReceivableTypeModel(receivableTypeJson[i]);
    XM.receivableTypes.add(receivableType);
  }

}());
