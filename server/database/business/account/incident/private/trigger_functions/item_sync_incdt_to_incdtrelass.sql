create or replace function private.item_sync_incdt_to_incdtrelass() returns trigger as $$
declare
  id integer;
begin

  -- handle inserts

  if ( TG_OP = 'INSERT' ) then
  
    if ( new.incdt_item_id is not null ) then

      alter table private.incdtrelass disable trigger "item_sync_incdtrelass_to_incdt";

      insert into private.incdtrelass (
        relass_source_id, relass_rel_id, relass_target_id )
      select new.incdt_id, rel_id, new.incdt_item_id
      from private.incdtrel
        join private.datatype on ( rel_datatype_id = datatype_id )
      where ( datatype_name = 'Item' );

      alter table private.incdtrelass enable trigger "item_sync_incdtrelass_to_incdt";

    end if;
    
  end if;

  -- handle updates

  if ( TG_OP = 'UPDATE' ) then

    if (COALESCE(old.incdt_item_id, -1) != COALESCE(new.incdt_item_id, -1)) then

      alter table private.incdtrelass disable trigger "item_sync_incdtrelass_to_incdt";

	  if (old.incdt_item_id is not null) then
	    
	    delete from private.incdtrelass
		where (relass_source_id = old.incdt_id
		and relass_target_id = old.incdt_item_id);
		
	  end if;
	
	  if (new.incdt_item_id is not null) then

	      insert into private.incdtrelass (
	        relass_source_id, relass_rel_id, relass_target_id )
	      select new.incdt_id, rel_id, new.incdt_item_id
	      from private.incdtrel
	        join private.datatype on ( rel_datatype_id = datatype_id )
	      where ( datatype_name = 'Item' );

	  end if;

      alter table private.incdtrelass enable trigger "item_sync_incdtrelass_to_incdt";

    end if;
    
  end if;

  return new;
  
end;
$$ language 'plpgsql';
