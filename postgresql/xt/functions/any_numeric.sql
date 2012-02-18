create or replace function private.any_numeric(arg1 numeric, arg2 numeric[]) returns boolean immutable as $$
  select array[$1] <@ $2;
$$ language 'sql';