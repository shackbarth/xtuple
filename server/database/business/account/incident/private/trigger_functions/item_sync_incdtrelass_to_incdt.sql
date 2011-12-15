create or replace function private.item_sync_incdtrelass_to_incdt() returns trigger as $$
declare
  datatype text;
  id integer;
  item integer;
begin

  -- set variables
  
  if ( TG_OP  = 'INSERT' ) then
    datatype := private.get_incdtrel_type_name(new.relass_rel_id);
    if ( datatype = 'Item' ) then
      id := new.relass_source_id;
      item := new.relass_target_id;
    end if;
  elseif ( TG_OP = 'DELETE' ) then
    datatype := private.get_incdtrel_type_name(old.relass_rel_id);
    id := old.relass_source_id;
    item := null;
  elseif (TG_OP = 'UPDATE') then
    datatype := private.get_incdtrel_type_name(old.relass_rel_id);
    id := old.relass_source_id;
    item := new.relass_target_id;
  end if;

  -- update incdt table
  
  if ( datatype = 'Item' ) then

    -- disable trigger on inverse side to avoid recursion

    alter table public.incdt disable trigger "item_sync_incdt_to_incdtrelass";
    
    update public.incdt set
      incdt_item_id = item
    where ( incdt_id = id );

    -- clean up

    alter table public.incdt enable trigger "item_sync_incdt_to_incdtrelass";

  end if;

  return new;
  
end;
$$ language 'plpgsql';
