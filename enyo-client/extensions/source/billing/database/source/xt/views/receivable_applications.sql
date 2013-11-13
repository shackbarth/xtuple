select xt.create_view('xt.receivable_applications', $$

  select arapply.*
  from arapply;

$$);