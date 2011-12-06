create or replace function private.core_sync_crmacct_to_crmacctroleass() returns trigger as $$
begin

  -- disable triggers on inverse side to avoid recursion
  
  alter table private.crmacctroleass disable trigger all;

  delete from private.crmacctroleass
  where (crmacctroleass_char_id = old.crmacct_id);

  alter table private.crmacctroleass enable trigger all;
    
  return old;
  
end;
$$ language 'plpgsql';
