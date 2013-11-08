select xt.install_js('XM','Receivable','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  if (!XM.Receivable) { XM.Receivable = {}; }

  XM.Receivable.isDispatchable = true;

  XM.Receivable.createCreditMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid) {
    // add receivable
    var insertSql = "insert into aropen ( obj_uuid, aropen_cust_id, aropen_docnumber, aropen_docdate, aropen_amount, aropen_duedate, aropen_curr_id, aropen_doctype, " +
    "aropen_commission_due, aropen_ordernumber, aropen_notes, aropen_terms_id, aropen_rsncode_id, aropen_salesrep_id, aropen_paid ) " +
        " values " +
        "( $1, (select cust_id from custinfo where cust_number = $2), $3, $4, $5, $6, " +
        "(select curr_id from curr_symbol where curr_abbr = $7), 'C', $8, $9, $10, (select terms_id from terms where terms_code = $11), " +
        "(select rsncode_id from rsncode where rsncode_code = $12), (select salesrep_id from salesrep where salesrep_number = $13), $14 );";
    plv8.elog(NOTICE, "insert sql: ", insertSql);
    plv8.execute(insertSql, [uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid]);

    var selectSql = "select aropen_id as result from aropen where obj_uuid = $1;";
    var id = plv8.execute(selectSql, [uuid])[0].result;
    plv8.elog(NOTICE, "id: ", id);

    // add tax with receivable as the parent
    // var insertTaxSql = "insert into aropentax " +
    //     "( obj_uuid, taxhist_parent_id, taxhist_tax_id, taxhist_amount, taxhist_basis, taxhist_percent, taxhist_curr_id, taxhist_tax, taxhist_docdate )" +
    //     "values " +
    //     "( '2747777', $1, (select tax_id from tax where tax_code = 'NC TAX-A'), 10, 0, 0, (select curr_id from curr_symbol where curr_abbr = 'USD'), 0, " +
    //     "'2013-11-03T00:00:00.000Z');";
    // plv8.elog(NOTICE, "insert sql: ", insertTaxSql);
    // plv8.execute(insertTaxSql, [id]);

    // do post
    //id = plv8.execute('select createarcreditmemo() as value', []);
    //pid integer, pcustid integer, pdocnumber text, pordernumber text, pdocdate date, pamount numeric, pnotes text, prsncodeid integer, psalescatid integer, paccntid integer, pduedate date, ptermsid integer, psalesrepid integer, pcommissiondue numeric DEFAULT 0, pjournalnumber integer DEFAULT NULL::integer, pcurrid integer DEFAULT basecurrid(), paraccntid integer DEFAULT NULL::integer, pcoccpayid integer DEFAULT NULL::integer)

    return id;
  };

  XM.Receivable.createDebitMemo = function (uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid) {
    // add receivable
    var insertSql = "insert into aropen ( obj_uuid, aropen_cust_id, aropen_docnumber, aropen_docdate, aropen_amount, aropen_duedate, aropen_curr_id, aropen_doctype, " +
    "aropen_commission_due, aropen_ordernumber, aropen_notes, aropen_terms_id, aropen_rsncode_id, aropen_salesrep_id, aropen_paid ) " +
        " values " +
        "( $1, (select cust_id from custinfo where cust_number = $2), $3, $4, $5, $6, " +
        "(select curr_id from curr_symbol where curr_abbr = $7), 'D', $8, $9, $10, (select terms_id from terms where terms_code = $11), " +
        "(select rsncode_id from rsncode where rsncode_code = $12), (select salesrep_id from salesrep where salesrep_number = $13), $14 );";
    plv8.elog(NOTICE, "insert sql: ", insertSql);
    plv8.execute(insertSql, [uuid, customer, docNum, docDate, amt, dueDate, currency, commission, orderNum, notes, terms, reasonCode, salesRep, paid]);

    var selectSql = "select aropen_id as result from aropen where obj_uuid = $1;";
    var id = plv8.execute(selectSql, [uuid])[0].result;
    plv8.elog(NOTICE, "id: ", id);

    // add tax with receivable as the parent
    // var insertTaxSql = "insert into aropentax " +
    //     "( obj_uuid, taxhist_parent_id, taxhist_tax_id, taxhist_amount, taxhist_basis, taxhist_percent, taxhist_curr_id, taxhist_tax, taxhist_docdate )" +
    //     "values " +
    //     "( '2747777', $1, (select tax_id from tax where tax_code = 'NC TAX-A'), 10, 0, 0, (select curr_id from curr_symbol where curr_abbr = 'USD'), 0, " +
    //     "'2013-11-03T00:00:00.000Z');";
    // plv8.elog(NOTICE, "insert sql: ", insertTaxSql);
    // plv8.execute(insertTaxSql, [id]);

    return id;
  };

$$ );