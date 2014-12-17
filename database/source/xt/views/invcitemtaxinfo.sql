select xt.create_view('xt.invcitemtaxinfo', $$
  -- this view exists to silently quash any writes to this business object.
  -- the data is all taken care of with triggers
select * from invcitemtax;

$$, true);
