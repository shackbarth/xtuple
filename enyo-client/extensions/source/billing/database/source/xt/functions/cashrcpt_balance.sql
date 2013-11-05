/**
 * Calculate the balance of a XM.CashReceipt
 * balance = amount - (applied + pending)
 */
create or replace function xt.cashrcpt_balance(cashrcpt) returns numeric stable as $$

  select
    coalesce(aropen_amount - aropen_paid - xt.cashrcpt_sum_pending($1), 0.0)

  from
    cashrcpt
    inner join cashrcptitem on ($1.cashrcpt_id = cashrcptitem_cashrcpt_id)
    inner join aropen       on (cashrcptitem_aropen_id = aropen_id)
  ;

$$ language sql;
