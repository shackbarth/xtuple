create or replace function private.useracct_duplicate_check() returns trigger as $$
declare
  result text;
begin

  select usr_username into result
  from public.usr p
  where ( p.usr_username = new.useracct_username );

  if ( found ) then
    raise exception 'User account % already exists as a database user.', new.useracct_username;
  end if;

  return new;
  
end;
$$ language 'plpgsql';
