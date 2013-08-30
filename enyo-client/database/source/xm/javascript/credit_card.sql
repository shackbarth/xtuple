select xt.install_js('XM','CreditCard','xtuple', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.CreditCard) { XM.CreditCard = {}; }

  XM.CreditCard.isDispatchable = true;

  /**


   @param {Number} payment id
   @param {Number} document id
   @param {String} document type
  */
  XM.CreditCard.postCredit = function (paymentId, documentId, documentType) {
    var sql = "SELECT postCCcashReceipt($1, $2, $3) AS cm_id;";

    plv8.execute(sql, [paymentId, documentId, documentType]);
  };
  XM.Tax.postCredit.description = "";
  XM.Tax.postCredit.params = {
    paymentId: {type: "Number", description: "Payment ID"},
    documentId: {type: "Number", description: "Document ID"},
    documentType: {type: "String", description: "Document Type"}
  };

}());

$$ );

