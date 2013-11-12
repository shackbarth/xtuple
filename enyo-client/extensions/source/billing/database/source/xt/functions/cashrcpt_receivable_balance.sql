/**
 * Calculate the balance of a XM.CashReceiptReceivable
 * balance = amount - (paid + all unposted)
 */
create or replace function xt.cashrcpt_receivable_balance(aropen) returns numeric stable as $$

  select
    coalesce(
      $1.aropen_amount - ($1.aropen_paid + xt.cashrcpt_receivable_sum_amount(aropen, false))
    )

  from
    cashrcpt
    inner join cashrcptitem  on (cashrcpt_id = cashrcptitem_cashrcpt_id)
    inner join aropen        on (cashrcptitem_aropen_id = aropen_id)
  ;

$$ language sql;
