/**
 * Sum applied amounts for a CashReceipt
 */
create or replace function xt.cashrcpt_sum_applied(cashrcpt) returns numeric stable as $$

  select
    coalesce(sum(applied_amount), 0.0)

  from
    xt.cashrcpt_receivable

  where
    cashrcpt_id = $1.cashrcpt_id AND
    curr_id = $1.cashrcpt_curr_id
  ;

$$ language sql;
