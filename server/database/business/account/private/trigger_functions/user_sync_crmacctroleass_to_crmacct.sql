create or replace function private.user_sync_crmacctroleass_to_crmacct() returns trigger as $$
declare
  datatype text;
  id integer;
  username text;
begin

  -- set variables
  
  if ( TG_OP  = 'INSERT' ) then
    datatype := private.get_crmacctrole_type_name(new.crmacctroleass_crmacctrole_id);
    if ( datatype = 'User' ) then
      id := new.crmacctroleass_crmacct_id;
      username := (select usr_username
                   from usr
                   where usr_id=new.crmacctroleass_target_id
                   union all
                   select user_username
                   from private.user
                   where oid::integer=new.crmacctroleass_target_id);
    end if;
  elseif ( TG_OP = 'DELETE' ) then
    datatype := private.get_crmacctrole_type_name(old.crmacctroleass_crmacctrole_id);
    id := old.crmacctroleass_crmacct_id;
    username := null;
  else
    raise exception 'Operation % not supported', TG_OP;
  end if;

  -- update table
  
  if ( datatype = 'User' ) then

    -- disable trigger on inverse side to avoid recursion

    alter table public.crmacct disable trigger "user_sync_crmacct_to_crmacctroleass";
    
    update public.crmacct set
      crmacct_usr_username = username
    where ( crmacct_id = id );

    -- clean up

    alter table public.crmacct enable trigger "user_sync_crmacct_to_crmacctroleass";

  end if;

  return new;
  
end;
$$ language 'plpgsql';
