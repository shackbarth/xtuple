select xt.install_js('XM','CreditCard','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.CreditCard) { XM.CreditCard = {}; }

  XM.CreditCard.isDispatchable = true;

  /**


   @param {Number} payment id
   @param {Number} documentNumber
   @param {String} document type
   @param {Number} amount
  */
  XM.CreditCard.postCashReceipt = function (paymentId, documentNumber, documentType, amount) {
    /* resolve natural keys to primary keys */
    /* TODO: this only works for sales order at the moment */
    var documentId = XT.Data.getId(XT.Orm.fetch('XM', 'SalesOrder'), documentNumber);
    var sql = "SELECT postCCcashReceipt($1, $2, $3, $4) AS cm_id;";

    plv8.execute(sql, [paymentId, documentId, documentType, amount]);
  };
  XM.CreditCard.postCashReceipt.description = "";
  XM.CreditCard.postCashReceipt.params = {
    paymentId: {type: "Number", description: "Payment ID"},
    documentId: {type: "Number", description: "Document Number"},
    documentType: {type: "String", description: "Document Type"},
    amount: {type: "Number", description: "Amount"}
  };

}());

$$ );

