/**
 * Aggregate the cash receipt line amounts. CashReceiptLine and CashReceipt
 * currencies should match, so no explicit conversion occurs here.
 *
 * @param {XM.CashReceipt}  the cash receipt
 * @param {Boolean}         whether to aggregate applied or un-applied amounts
 * @returns sum of CashReceiptLine amounts for this CashReceipt
 */
create or replace function xt.cashrcpt_sum_amount(cashrcpt, boolean)
returns numeric stable as $$

  select
    coalesce(sum(cashrcptitem_amount), 0.0)

  from
    cashrcptitem
    inner join cashrcpt on ($1.cashrcpt_id = cashrcptitem_cashrcpt_id)

  where
    cashrcptitem_applied = $2
  ;

$$ language sql;
