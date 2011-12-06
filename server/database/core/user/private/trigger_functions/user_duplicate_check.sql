create or replace function private.user_duplicate_check() returns trigger as $$
declare
  result text;
begin

  select usr_username into result
  from public.usr p
  where ( p.usr_username = new.user_username );

  if ( found ) then
    raise exception 'User % already exists as a database user.', new.usr_username;
  end if;

  return new;
  
end;
$$ language 'plpgsql';
