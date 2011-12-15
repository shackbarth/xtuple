-- drop table private.incdtrel;

-- table definition

select private.create_table('incdtrel', 'private', 'private.rel');
select private.add_constraint('incdtrel', 'incdtrel_pkey', 'primary key (rel_id)');
alter table private.incdtrel alter column rel_datatype_id set not null;
select private.add_constraint('incdtrel', 'incdtrel_rel_datatype_id_unique', 'unique (rel_datatype_id)');
select private.add_constraint('incdtrel', 'incdtrel_rel_datatype_id_fkey', 'foreign key (rel_datatype_id) references private.datatype (datatype_id)');

-- populate data

insert into private.incdtrel (rel_datatype_id) select datatype_id 
from private.datatype 
where (datatype_name = 'Item')
 and (not exists (select * from private.incdtrel join private.datatype on (rel_datatype_id = datatype_id) where (datatype_name = 'Item')));