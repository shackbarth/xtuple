select xt.create_view('xt.invcitemtaxinfo', $$

select * from invcitemtax;

$$, false);

create or replace rule "_INSERT" as on insert to xt.invcitemtaxinfo do instead nothing;
create or replace rule "_UPDATE" as on update to xt.invcheadinfo do instead nothing;
create or replace rule "_DELETE" as on delete to xt.invcheadinfo do instead nothing;
