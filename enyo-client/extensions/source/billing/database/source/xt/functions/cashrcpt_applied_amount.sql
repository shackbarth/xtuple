/**
 * Aggregate the cash receipt line amounts. CashReceiptLine and CashReceipt
 * currencies should match, so no explicit conversion occurs here.
 *
 * @param {Integer} cashrcpt_id
 * @param {Boolean} whether to aggregate applied or un-applied amounts
 * @returns sum of CashReceiptLine amounts for this CashReceipt
 */
create or replace function xt.cashrcpt_applied_amount(numeric, boolean)
returns numeric stable as $$

  select
    coalesce(sum(cashrcptitem_amount), 0)

  from
    cashrcptitem

  where
    cashrcptitem_cashrcpt_id = $1 and
    cashrcptitem_applied = $2;

$$ language sql;
