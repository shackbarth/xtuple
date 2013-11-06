select xt.create_view('xt.aropeninfo', $$

  select aropen.*,
    xt.ar_balance(aropen) as balance,
    xt.ar_tax_total(aropen) as tax_total
  from aropen;

$$,false);

create or replace rule "_INSERT" as on insert to xt.aropeninfo do instead nothing;
create or replace rule "_DELETE" as on delete to xt.aropeninfo do instead nothing;

