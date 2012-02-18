create or replace function xt.any_text(arg1 text, arg2 text[]) returns boolean immutable as $$
  select array[$1] <@ $2;
$$ language 'sql';
