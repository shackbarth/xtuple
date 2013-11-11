create or replace function xt.ar_balance(aropen) returns numeric stable as $$
  select $1.aropen_amount - $1.aropen_paid;
$$ language sql;