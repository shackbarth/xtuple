/**
 * Calculate the balance of a XM.CashReceipt
 * balance = amount - applied
 */
create or replace function xt.cashrcpt_balance(cashrcpt) returns numeric stable as $$

  select
    coalesce($1.cashrcpt_amount - xt.cashrcpt_sum_amount($1, true))

  from
    cashrcpt;

$$ language sql;
