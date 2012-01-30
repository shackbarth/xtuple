create or replace function private.any_text(arg1 text, arg2 text[]) returns boolean immutable as $$
  select array[$1] <@ $2;
$$ language 'sql';