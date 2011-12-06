create or replace function private.address_sync_charroleass_to_char() returns trigger as $$
declare
  datatype text;
  id integer;
  state boolean;
begin

  -- set variables
  
  if ( TG_OP  = 'INSERT' ) then
    datatype := private.get_charrole_type_name(new.charroleass_charrole_id);
    id := new.charroleass_char_id;
    state := true;
  elseif ( TG_OP = 'DELETE' ) then
    datatype := private.get_charrole_type_name(old.charroleass_charrole_id);
    id := old.charroleass_char_id;
    state := false;
  else
    raise exception 'Operation % not supported', TG_OP;
  end if;

  -- update table
  
  if ( datatype = 'Address' ) then

    -- disable trigger on inverse side to avoid recursion

    alter table public.char disable trigger "address_sync_char_to_charroleass";
  
    update public.char set
      char_addresses = state
    where ( char_id = id );

    alter table public.char enable trigger "address_sync_char_to_charroleass";

  end if;

  return new;
  
end;
$$ language 'plpgsql';
