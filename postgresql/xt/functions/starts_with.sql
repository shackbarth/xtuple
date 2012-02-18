create or replace function xt.starts_with(arg1 text, arg2 text) returns boolean immutable as $$
  select $1 ~ ('^' || $2);
$$ language 'sql';
