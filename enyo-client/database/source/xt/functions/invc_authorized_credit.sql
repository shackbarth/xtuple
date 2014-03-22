create or replace function xt.invc_authorized_credit(invoice_number text) returns numeric stable as $$
  
  var metricSql = "select metric_value::integer from metric where metric_name = 'CCValidDays';",
    sql = "SELECT COALESCE(SUM(currToCurr(payco_curr_id, invchead_curr_id, payco_amount, invchead_invcdate)),0) AS amount " + 
      "from invchead " +
      "inner join cohead on invchead_ordernumber = cohead_number " +
      "inner join payco on cohead_id = payco_cohead_id " +
      "inner join ccpay on payco_ccpay_id = ccpay_id " +
      "where invchead_invcnumber = $1 " +
      "and ccpay_status = 'A' " +
      "and (date_part('day', CURRENT_TIMESTAMP - ccpay_transaction_datetime) < $2);",
    metricResult = plv8.execute(metricSql),
    validDays = metricResult.length ? metricResult[0].count : 7;

  return plv8.execute(sql, [invoice_number, validDays])[0].amount;

$$ language plv8;
