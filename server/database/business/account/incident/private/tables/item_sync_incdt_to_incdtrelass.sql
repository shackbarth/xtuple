-- trigger: item_sync_incdt_to_incdtrelass on incdt

-- drop trigger item_sync_incdt_to_incdtrelass on incdt;

create or replace trigger item_sync_incdt_to_incdtrelass
  after insert or update
  on incdt
  for each row
  execute procedure private.item_sync_incdt_to_incdtrelass();