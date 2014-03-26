create or replace function xt.any_uuid(arg1 uuid, arg2 uuid[]) returns boolean immutable as $$
  select array[$1] <@ $2;
$$ language 'sql';
