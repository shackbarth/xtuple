-- table definition

select private.create_table('crmacctrole');
select private.add_column('crmacctrole', 'crmacctrole_id', 'serial', 'primary key');
select private.add_column('crmacctrole', 'crmacctrole_datatype_id', 'integer', 'not null unique references private.datatype (datatype_id)');

-- populate data

insert into private.crmacctrole (crmacctrole_datatype_id) select datatype_id 
from private.datatype 
where (datatype_name = 'User')
 and ( not exists (select * from private.crmacctrole join private.datatype on (crmacctrole_datatype_id = datatype_id) where ( datatype_name = 'User') ) );





