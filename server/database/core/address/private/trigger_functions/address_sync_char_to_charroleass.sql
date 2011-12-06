create or replace function private.address_sync_char_to_charroleass() returns trigger as $$
begin
  
  -- handle inserts

  if ( TG_OP = 'INSERT' ) then
  
    if ( new.char_addresses ) then

      alter table private.charroleass disable trigger "address_sync_charroleass_to_char";

      insert into private.charroleass (
        charroleass_char_id, charroleass_charrole_id )
      select new.char_id, charrole_id
      from private.charrole
        join private.datatype on ( charrole_datatype_id = datatype_id )
      where ( datatype_name = 'Address' );

      alter table private.charroleass enable trigger "address_sync_charroleass_to_char";

    end if;
    
  end if;

  -- handle updates

  if ( TG_OP = 'UPDATE' ) then

    -- addresss
    
    if ( old.char_addresses != new.char_addresses and new.char_addresses ) then

      alter table private.charroleass disable trigger "address_sync_charroleass_to_char";
    
      insert into private.charroleass (
        charroleass_char_id, charroleass_charrole_id )
      select new.char_id, charrole_id
      from private.charrole
        join private.datatype on ( charrole_datatype_id = datatype_id )
      where ( datatype_name = 'Address' );

      alter table private.charroleass enable trigger "address_sync_charroleass_to_char";

    elsif ( old.char_addresses != new.char_addresses and not new.char_addresses ) then

      alter table private.charroleass disable trigger "address_sync_charroleass_to_char";

      delete from private.charroleass
      where ( charroleass_char_id = old.char_id )
       and ( private.get_charrole_type_name(charroleass_charrole_id) = 'Address' );

      alter table private.charroleass enable trigger "address_sync_charroleass_to_char";
      
    end if;
    
  end if;

  return new;
  
end;
$$ language 'plpgsql';
