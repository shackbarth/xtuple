select xt.install_js('XM', 'Receivable', 'billing', $$

(function () {

  if (!XM.Receivable) { XM.Receivable = {}; }

  XM.Receivable.isDispatchable = true;

  XM.Receivable.insertReceivable = function (params) {
    XT.debug("insert receivable");

    var insertRecSql = "insert into aropen" +
      "(obj_uuid, aropen_cust_id, aropen_docnumber, aropen_ordernumber," +
      "aropen_docdate, aropen_amount, aropen_notes, aropen_rsncode_id," +
      "aropen_salescat_id, aropen_accnt_id, aropen_duedate, aropen_terms_id," +
      "aropen_salesrep_id, aropen_commission_due, aropen_journalnumber," +
      "aropen_curr_id, aropen_paid,aropen_commission_paid, aropen_applyto," +
      "aropen_open, aropen_doctype, aropen_username)" +
      "values" +
      "($1, $2, $3, $4, $5, round($6, 2), $7, $8, $9, $10, $11, $12, $13," +
      "$14, $15, $16, 0, FALSE, TRUE, 'C', getEffectiveXtUser());"

    plv8.execute(insertRecSql, params);
  }

  /**
    - Insert an aropen record
    - Insert tax records
    - Run the createarcreditmemo function
   @param {Object} JSON credit memo attributes object
  */
  XM.Receivable.createCreditMemo = function (params) {
    XM.Receivable.insertReceivable(params);

    //return plv8.execute('select createarcreditmemo() as value', params)[0].value;
  };

  /**
    - Insert an aropen record
    - Insert tax records
    - Run the createardebitmemo function
   @param {Object} JSON debit memo attributes object
  */
  XM.Receivable.createDebitMemo = function (params) {
    XM.Receivable.insertReceivable(params);

    //return plv8.execute('select createardebitmemo() as value', params)[0].value;
  };

})();

$$ );