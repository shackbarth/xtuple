select xt.create_view('xt.arapplyinfo', $$

  select arapply.*
  from arapply
  where arapply_source_aropen_id = arapply_target_aropen_id;

$$);