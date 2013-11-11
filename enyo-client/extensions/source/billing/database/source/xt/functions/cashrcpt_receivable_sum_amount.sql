/**
 * Aggregate the cash receipt line amounts; it is necessary to convert the
 * amount of each CashReceiptLine to the currency of the CashReceiptReceivable.
 *
 * @param {XM.CashReceiptReceivable}  the cash receipt receivable
 * @param {Boolean}                   whether to aggregate applied or un-applied amounts
 * @returns sum of CashReceiptLine amounts for this CashReceiptReceivable
 */
create or replace function xt.cashrcpt_receivable_sum_amount(aropen, boolean)
returns numeric stable as $$

  select distinct on (cashrcptitem_id)
    coalesce(
      -- aggregate CashReceiptLine amounts
      sum(
        -- convert CashReceiptLine currency to that of CashReceiptReceivable
        currtocurr(
          cashrcpt_curr_id,
          aropen_curr_id,
          cashrcptitem_amount,
          cashrcpt_distdate
        )
      ), 0
    )

  from
    cashrcptitem
    inner join aropen on ($1.aropen_id = cashrcptitem_aropen_id)
    inner join cashrcpt on (cashrcptitem_cashrcpt_id = cashrcpt_id)

  where
    cashrcptitem_applied = $2
  ;

$$ language sql;

