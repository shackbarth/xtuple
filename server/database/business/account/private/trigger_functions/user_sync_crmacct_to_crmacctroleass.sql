create or replace function private.user_sync_crmacct_to_crmacctroleass() returns trigger as $$
declare
  id integer;
begin

  -- handle inserts

  if ( TG_OP = 'INSERT' ) then
  
    if ( new.crmacct_usr_username is not null ) then

      alter table private.crmacctroleass disable trigger "user_sync_crmacctroleass_to_crmacct";

      select user_id into id 
      from (
        select usr_id
        from usr
        where usr_username=new.crmacct_usr_username
        union all
        select oid::integer
        from private.user
        where user_username=new.crmacct_usr_username
      ) data;
      
      insert into private.crmacctroleass (
        crmacctroleass_crmacct_id, crmacctroleass_crmacctrole_id, crmacctroleass_target_id )
      select new.crmacct_id, crmacctrole_id, id
      from private.crmacctrole
        join private.datatype on ( crmacctrole_datatype_id = datatype_id )
      where ( datatype_name = 'User' );

      alter table private.crmacctroleass enable trigger "user_sync_crmacctroleass_to_crmacct";

    end if;
    
  end if;

  -- handle updates

  if ( TG_OP = 'UPDATE' ) then

    -- contacts
    
    if ( old.crmacct_usr_username != new.crmacct_usr_username and new.crmacct_usr_username is not null ) then

      alter table private.crmacctroleass disable trigger "user_sync_crmacctroleass_to_crmacct";

      select user_id into id 
      from (
        select usr_id
        from usr
        where usr_username=new.crmacct_usr_username
        union all
        select oid::integer
        from private.user
        where user_username=new.crmacct_usr_username
      ) data;
    
      insert into private.crmacctroleass (
        crmacctroleass_crmacct_id, crmacctroleass_crmacctrole_id, crmacctroleass_target_id )
      select new.crmacct_id, crmacctrole_id, id
      from private.crmacctrole
        join private.datatype on ( crmacctrole_datatype_id = datatype_id )
      where ( datatype_name = 'User' );

      alter table private.crmacctroleass enable trigger "user_sync_crmacctroleass_to_crmacct";

    elsif ( old.crmacct_contacts != new.crmacct_contacts and not new.crmacct_contacts ) then

      alter table private.crmacctroleass disable trigger "user_sync_crmacctroleass_to_crmacct";

      delete from private.crmacctroleass
      where ( crmacctroleass_crmacct_id = old.crmacct_id )
       and ( private.get_crmacctrole_type_name(crmacctroleass_crmacctrole_id) = 'User' );

      alter table private.crmacctroleass enable trigger "user_sync_crmacctroleass_to_crmacct";
      
    end if;
    
  end if;

  return new;
  
end;
$$ language 'plpgsql';
