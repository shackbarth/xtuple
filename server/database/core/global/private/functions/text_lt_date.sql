create or replace function private.text_lt_date(arg1 text, arg2 date) returns boolean immutable as $$
  select case when isdate($1) then $1::date < $2 else false;
$$ language 'sql';