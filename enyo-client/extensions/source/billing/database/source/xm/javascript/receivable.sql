select xt.install_js('XM','Receivable','xtuple', $$

  if (!XM.Receivable) { XM.Receivable = {}; }

  XM.Receivable.isDispatchable = true;

  /* Insert receivable and taxes into the database */
  XM.Receivable.insertReceivable = function (uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, documentType) {
    /* add receivable */
    var insertSql = "insert into aropen ( obj_uuid, aropen_cust_id, aropen_docnumber, aropen_docdate, aropen_amount, aropen_duedate, aropen_curr_id, aropen_doctype, " +
    "aropen_commission_due, aropen_ordernumber, aropen_notes, aropen_terms_id, aropen_rsncode_id, aropen_salesrep_id, aropen_paid, aropen_posted ) " +
        " values " +
        "( $1, $2, $3, $4, $5, $6, $7, 'C', $8, $9, $10, $11, $12, $13, $14, true );";
    plv8.elog(NOTICE, "insert sql: ", insertSql);
    plv8.execute(insertSql, [uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid]);

    var selectSql = "select aropen_id as result from aropen where obj_uuid = $1;";
    var id = plv8.execute(selectSql, [uuid])[0].result;
    plv8.elog(NOTICE, "id: ", id);

    /*
        var insertTaxSql = "insert into aropentax " +
        "( obj_uuid, taxhist_parent_id, taxhist_tax_id, taxhist_amount, taxhist_basis, taxhist_percent, taxhist_curr_id, taxhist_tax, taxhist_docdate )" +
        "values " +
        "( '2747777', $1, (select tax_id from tax where tax_code = 'NC TAX-A'), 10, 0, 0, (select curr_id from curr_symbol where curr_abbr = 'USD'), 0, " +
        "'2013-11-03T00:00:00.000Z');";
        plv8.elog(NOTICE, "insert sql: ", insertTaxSql);
        plv8.execute(insertTaxSql, [id]);
    */
    return id;
  };

  /* Post credit memo */
  XM.Receivable.createCreditMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid) {
    /* resolve natural keys to primary keys */
    var customerId = customer ? XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customer) : null;
    var currencyId = currency ? XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currency) : null;
    var salesRepId = salesRep ? XT.Data.getId(XT.Orm.fetch('XM', 'SalesRep'), salesRep) : null;
    var reasonCodeId = reasonCode ? XT.Data.getId(XT.Orm.fetch('XM', 'ReasonCode'), reasonCode) : null;
    var termsId = terms ? XT.Data.getId(XT.Orm.fetch('XM', 'Terms'), terms) : null;

    /* insert receivable/taxes */
    var recId = XM.Receivable.insertReceivable(uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, 'C');

    /* do post */
    id = plv8.execute('select createarcreditmemo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) as value',
        [recId, customerId, docNum, orderNum, docDate, amt, notes, reasonCodeId, -1, -1, dueDate, termsId, salesRepId,commission, null, currencyId, null, null])[0].value;

    /* return id from post */
    return id;
  };

  /* post debit memo */
  XM.Receivable.createDebitMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid) {
    /* resolve natural keys to primary keys */
    var customerId = customer ? XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customer) : null;
    var currencyId = currency ? XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currency) : null;
    var salesRepId = salesRep ? XT.Data.getId(XT.Orm.fetch('XM', 'SalesRep'), salesRep) : null;
    var reasonCodeId = reasonCode ? XT.Data.getId(XT.Orm.fetch('XM', 'ReasonCode'), reasonCode) : null;
    var termsId = terms ? XT.Data.getId(XT.Orm.fetch('XM', 'Terms'), terms) : null;

    /* insert receivable/taxes */
    var recId = XM.Receivable.insertReceivable(uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, 'D');

    /* do post */
    id = plv8.execute('select createarcreditmemo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) as value',
        [recId, customerId, docNum, orderNum, docDate, amt, notes, reasonCodeId, -1, -1, dueDate, termsId, salesRepId,commission, null, currencyId, null, null])[0].value;

    /* return id from post */
    return id;
  };

$$ );