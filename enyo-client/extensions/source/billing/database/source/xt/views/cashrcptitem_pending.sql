/**
 * Return only XM.CashReceiptLine items that are pending, i.e.
 * applied = false.
 */
select xt.create_view('xt.cashrcptitem_pending', $$

  select
    obj_uuid,
    cashrcpt_id,
    cashrcptitem_id       as id,
    cashrcptitem_amount   as amount,
    cashrcptitem_discount as discount_amount,
    cashrcpt_curr_id      as curr_id,
    cashrcpt_curr_rate    as curr_rate

  from
    cashrcptitem
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)
    
  where
    cashrcptitem_applied = false
  ;

$$);
