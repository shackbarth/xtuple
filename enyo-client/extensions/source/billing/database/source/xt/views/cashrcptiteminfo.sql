/**
 * @alias XM.CashReceiptLine
 * 
 * Returns a CashReceipt with its appliedAmount and balance pre-calculated.
 */
select xt.create_view('xt.cashrcptiteminfo', $$

  select * from xt.cashrcpt_receivable

  where
    cashrcpt_posted
      AND (cashrcptitem_cashrcpt_id = cashrcpt_id)

    OR NOT cashrcpt_posted
      AND (open AND cust_id = cashrcpt_cust_id)

$$);

