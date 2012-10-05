create or replace function xt.text_gt_date(arg1 text, arg2 date) returns boolean immutable as $$
  select case when xt.is_date($1) then $1::date > $2 else false end;
$$ language 'sql';
