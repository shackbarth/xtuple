-- drop table private.incdtrelass;

-- table definition

select private.create_table('incdtrelass', 'private', 'private.relass');
select private.add_constraint('incdtrelass', 'incdtrelass_pkey', 'primary key (relass_id)');
alter table private.incdtrelass alter column relass_source_id set not null;
alter table private.incdtrelass alter column relass_rel_id set not null;
select private.add_constraint('incdtrelass', 'incdtrelass_relass_rel_id_fkey', 'foreign key (relass_rel_id) references private.incdtrel (rel_id)');
select private.add_constraint('incdtrelass', 'incdtrelass_relass_source_id_incdtrelass_relass_rel_id_unique', 'unique (relass_source_id, relass_rel_id)');

-- remove old trigger if any

 select dropIfExists('TRIGGER', 'item_sync_incdtrelass_to_incdt', 'private');

insert into private.incdtrelass (relass_source_id, relass_rel_id, relass_target_id)
select * from (
select
  incdt_id,
  rel_id,
  item_id
from incdt
  join item on incdt_item_id = item_id, 
  private.incdtrel
  join private.datatype on rel_datatype_id = datatype_id
where ( incdt_item_id is not null)
 and (datatype_name ='Item')
 ) data
where not exists (
  select * 
  from private.incdtrelass
  where (relass_source_id = incdt_id)
   and (relass_rel_id = rel_id)
);

-- create trigger

  create trigger item_sync_incdtrelass_to_incdt after insert or update or delete on private.incdtrelass for each row execute procedure private.item_sync_incdtrelass_to_incdt();

