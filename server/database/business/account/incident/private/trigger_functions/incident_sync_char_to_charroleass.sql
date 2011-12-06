create or replace function private.incident_sync_char_to_charroleass() returns trigger as $$
begin

  -- handle inserts

  if ( TG_OP = 'INSERT' ) then
  
    if ( new.char_incidents ) then

      alter table private.charroleass disable trigger "incident_sync_charroleass_to_char";

      insert into private.charroleass (
        charroleass_char_id, charroleass_charrole_id )
      select new.char_id, charrole_id
      from private.charrole
        join private.datatype on ( charrole_datatype_id = datatype_id )
      where ( datatype_name = 'Incident' );

      alter table private.charroleass enable trigger "incident_sync_charroleass_to_char";

    end if;
    
  end if;

  -- handle updates

  if ( TG_OP = 'UPDATE' ) then
    
    if ( old.char_incidents != new.char_incidents and new.char_incidents ) then

      alter table private.charroleass disable trigger "incident_sync_charroleass_to_char";
    
      insert into private.charroleass (
        charroleass_char_id, charroleass_charrole_id )
      select new.char_id, charrole_id
      from private.charrole
        join private.datatype on ( charrole_datatype_id = datatype_id )
      where ( datatype_name = 'Incident' );

      alter table private.charroleass enable trigger "incident_sync_charroleass_to_char";

    elsif ( old.char_incidents != new.char_incidents and not new.char_incidents ) then

      alter table private.charroleass disable trigger "incident_sync_charroleass_to_char";

      delete from private.charroleass
      where ( charroleass_char_id = old.char_id )
       and ( private.get_charrole_type_name(charroleass_charrole_id) = 'Incident' );

      alter table private.charroleass enable trigger "incident_sync_charroleass_to_char";

    end if;
    
  end if;

  return new;
  
end;
$$ language 'plpgsql';
