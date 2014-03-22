/**
 * @alias XM.CashReceiptLinePending
 *
 * Return only XM.CashReceiptLine items that are pending, i.e.
 * cashrcpt_posted = false.
 */
select xt.create_view('xt.cashrcptitem_pending', $$

  select *
    
  from
    cashrcptitem
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)
  
  where
    not cashrcpt_posted;

$$);
