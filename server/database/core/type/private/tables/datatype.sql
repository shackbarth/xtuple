-- table definition

select private.create_table('datatype');
select private.add_column('datatype','datatype_id', 'serial', 'primary key');
select private.add_column('datatype','datatype_name', 'text', 'not null unique');
select private.add_column('datatype','datatype_descrip', 'text', 'not null');
select private.add_column('datatype','datatype_source', 'text');
select private.add_constraint('datatype', 'datatype_source_key', 'unique (datatype_source)');
