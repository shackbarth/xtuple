create or replace function xt.cashrcpt_sum_pending(cashrcpt) returns numeric stable as $$

  select
    coalesce(sum(amount), 0.0)

  from
    xt.cashrcptitem_pending

  where
    cashrcpt_id = $1.cashrcpt_id AND
    curr_id = $1.cashrcpt_curr_id
  ;

$$ language sql;
