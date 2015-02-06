create or replace function xt.co_authorized_credit(sales_order_number text) returns numeric stable as $$
  
  var metricSql = "select metric_value::integer from metric where metric_name = 'CCValidDays';",
    metricSql2 = "select metric_value::text from metric where metric_name = 'soPriceEffective';",
    sql = "SELECT COALESCE(SUM(currToCurr(payco_curr_id, cohead_curr_id, payco_amount, $3)),0) AS amount " + 
      "from cohead " +
      "inner join payco on cohead_id = payco_cohead_id " +
      "inner join ccpay on payco_ccpay_id = ccpay_id " +
      "where cohead_number = $1 " +
      "and ccpay_status = 'A' " +
      "and (date_part('day', CURRENT_TIMESTAMP - ccpay_transaction_datetime) < $2);",
    metricResult = plv8.execute(metricSql),
    validDays = metricResult.length ? metricResult[0].count : 7,
    metricResult2 = plv8.execute(metricSql2),
    effeciveDate;
    
    if (metricResult2 === "ScheduleDate") {
      effectiveDate = plv8.execute("select getsoscheddate(cohead_id)::date as pdate from cohead where cohead_number = $1;", [sales_order_number])[0].pdate;
    } else if (metricResult2 === "OrderDate") {
      effectiveDate = plv8.execute("select cohead_orderdate::date as pdate from cohead where cohead_number = $1;", [sales_order_number])[0].pdate;
    } else {
      effectiveDate = plv8.execute("select current_date::date as pdate;")[0].pdate;
    }

  return plv8.execute(sql, [sales_order_number, validDays, effectiveDate])[0].amount;

$$ language plv8;
