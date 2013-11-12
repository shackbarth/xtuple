select xt.create_view('xt.invcitemtaxinfo', $$

select * from invcitemtax;

$$, true);
