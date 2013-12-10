select xt.create_view('xt.cmitemtaxinfo', $$
  -- this view exists to silently quash any writes to this business object.
  -- the data is all taken care of with triggers
select * from cmitemtax;

$$, true);
