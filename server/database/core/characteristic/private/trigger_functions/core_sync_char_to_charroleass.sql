create or replace function private.core_sync_char_to_charroleass() returns trigger as $$
begin

  -- disable triggers on inverse side to avoid recursion
  
  alter table private.charroleass disable trigger all;

  delete from private.charroleass
  where (charroleass_char_id = old.char_id);

  alter table private.charroleass enable trigger all;
    
  return old;
  
end;
$$ language 'plpgsql';
