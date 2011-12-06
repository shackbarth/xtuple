-- table definition

select private.create_table('charrole');
select private.add_column('charrole', 'charrole_id', 'serial', 'primary key');
select private.add_column('charrole', 'charrole_datatype_id', 'integer', 'not null unique references private.datatype (datatype_id)');
