create or replace function xt.not_any_numeric(arg1 numeric, arg2 numeric[]) returns boolean immutable as $$
  select not array[$1] <@ $2;
$$ language 'sql';
