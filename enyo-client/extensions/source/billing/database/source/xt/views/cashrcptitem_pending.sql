/**
 * @alias XM.CashReceiptLinePending
 * Return only XM.CashReceiptLine items that are pending, i.e.
 * applied = false.
 */
select xt.create_view('xt.cashrcptitem_pending', $$

  select * from cashrcptitem where cashrcptitem_applied = false;

$$);
