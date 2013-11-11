select xt.install_js('XM','Receivable','xtuple', $$

  if (!XM.Receivable) { XM.Receivable = {}; }

  XM.Receivable.isDispatchable = true;

  /* Insert receivable and taxes into the database */
  XM.Receivable.insertReceivable = function (uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, taxes, documentType) {
    /* add receivable */
    var insertSql = "insert into aropen ( obj_uuid, aropen_cust_id, aropen_docnumber, aropen_docdate, aropen_amount, aropen_duedate, aropen_curr_id, aropen_doctype, " +
    "aropen_commission_due, aropen_ordernumber, aropen_notes, aropen_terms_id, aropen_rsncode_id, aropen_salesrep_id, aropen_paid, aropen_posted ) " +
        " values " +
        "( $1, $2, $3, $4, $5, $6, $7, $15, $8, $9, $10, $11, $12, $13, $14, true );";
    plv8.elog(NOTICE, "insert sql: ", insertSql);
    plv8.execute(insertSql, [uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, documentType]);

    var selectSql = "select aropen_id as result from aropen where obj_uuid = $1;";
    var id = plv8.execute(selectSql, [uuid])[0].result;
    plv8.elog(NOTICE, "id: ", id);

    for (var i = 0; i < taxes.length; i++) {
        plv8.elog(NOTICE, "taxes: ", taxes[i]);
        var taxAmount = taxes[i].amount,
            taxParent = taxes[i].parent ? XT.Data.getId(XT.Orm.fetch('XM', 'Receivable'), taxes[i].parent) : null,
            taxCodeId = taxes[i].taxCode ? XT.Data.getId(XT.Orm.fetch('XM', 'TaxCode'), taxes[i].taxCode) : null,
            taxTypeId = taxes[i].taxType ? XT.Data.getId(XT.Orm.fetch('XM', 'TaxType'), taxes[i].taxType) : null,
            taxUuid = taxes[i].uuid;
        var insertTaxSql = "insert into aropentax " +
        "( obj_uuid, taxhist_parent_id, taxhist_tax_id, taxhist_amount, taxhist_curr_id, taxhist_docdate, taxhist_tax, taxhist_basis, taxhist_percent )" +
        "values " +
        "( $1, $2, $3, $4, $5, $6, $4, 0, 0);";
        plv8.elog(NOTICE, "insert sql: ", insertTaxSql);
        plv8.execute(insertTaxSql, [taxUuid, taxParent, taxCodeId, taxAmount, currencyId, docDate]);
    }
    return id;
  };

  /* Post credit memo */
  XM.Receivable.createCreditMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid, taxes) {
    /* resolve natural keys to primary keys */
    var customerId = customer ? XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customer) : null;
    var currencyId = currency ? XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currency) : null;
    var salesRepId = salesRep ? XT.Data.getId(XT.Orm.fetch('XM', 'SalesRep'), salesRep) : null;
    var reasonCodeId = reasonCode ? XT.Data.getId(XT.Orm.fetch('XM', 'ReasonCode'), reasonCode) : null;
    var termsId = terms ? XT.Data.getId(XT.Orm.fetch('XM', 'Terms'), terms) : null;

    /* insert receivable/taxes */
    var recId = XM.Receivable.insertReceivable(uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, taxes, 'C');

    /* do post */
    id = plv8.execute('select createarcreditmemo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) as value',
        [recId, customerId, docNum, orderNum, docDate, amt, notes, reasonCodeId, -1, -1, dueDate, termsId, salesRepId,commission, null, currencyId, null, null])[0].value;

    /* return id from post */
    return id;
  };

  /* post debit memo */
  XM.Receivable.createDebitMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid, taxes) {
    /* resolve natural keys to primary keys */
    var customerId = customer ? XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customer) : null;
    var currencyId = currency ? XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currency) : null;
    var salesRepId = salesRep ? XT.Data.getId(XT.Orm.fetch('XM', 'SalesRep'), salesRep) : null;
    var reasonCodeId = reasonCode ? XT.Data.getId(XT.Orm.fetch('XM', 'ReasonCode'), reasonCode) : null;
    var termsId = terms ? XT.Data.getId(XT.Orm.fetch('XM', 'Terms'), terms) : null;

    /* insert receivable/taxes */
    var recId = XM.Receivable.insertReceivable(uuid, customerId, docNum, docDate, amt, dueDate, currencyId, commission, orderNum, notes, termsId, reasonCodeId, salesRepId, paid, taxes, 'D');

    /* do post */
    id = plv8.execute('select createardebitmemo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) as value',
        [recId, customerId, docNum, orderNum, docDate, amt, notes, reasonCodeId, -1, -1, dueDate, termsId, salesRepId,commission, null, currencyId, null, null])[0].value;

    /* return id from post */
    return id;
  };

$$ );