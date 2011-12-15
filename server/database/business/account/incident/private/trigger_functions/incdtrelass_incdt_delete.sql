create or replace function private.incdtrelass_incdt_delete() returns trigger as $$

begin

  if exists (
	select 1
	from private.relass
	join private.rel on (relass_rel_id = rel_id)
	join private.datatype on (rel_datatype_id = datatype_id)
    where (datatype_name = 'Incident')
    and (relass_target_id = old.incdt_id)) then

    RAISE EXCEPTION 'Record in use';
  end if;
  
  return old;
end;

$$ language 'plpgsql';