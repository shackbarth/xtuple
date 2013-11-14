/**
 * @alias XM.CashReceiptLine
 * 
 * Returns a CashReceipt with its appliedAmount and balance pre-calculated.
 */
select xt.create_view('xt.cashrcptiteminfo', $$

  select *
    
  from
    cashrcptitem
    inner join aropen on (cashrcptitem_aropen_id = aropen_id)
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)

  where
    cashrcpt_posted
      and (cashrcptitem_cashrcpt_id = cashrcpt_id)

    or not cashrcpt_posted
      and (aropen_open and aropen_cust_id = cashrcpt_cust_id);

$$);

