create or replace function xt.ar_commission(aropen) returns numeric stable as $$
  select $1.aropen_amount * $1.aropen_commission_due;
$$ language sql;