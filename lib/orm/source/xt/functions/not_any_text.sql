create or replace function xt.not_any_text(arg1 text, arg2 text[]) returns boolean immutable as $$
  select not array[$1] <@ $2;
$$ language 'sql';
