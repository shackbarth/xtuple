-- table definition

select private.create_table('model');
select private.add_column('model','model_id', 'serial', 'primary key');
select private.add_column('model','model_namespace', 'text', E'not null default \'xm\'');
select private.add_column('model','model_name', 'text', 'not null unique');
select private.add_column('model','model_comment', 'text', 'not null default ''{}''');
select private.add_column('model','model_system', 'boolean', 'not null default false');
select private.add_column('model','model_schema_name', 'text', 'not null');
select private.add_column('model','model_table_name', 'text', 'not null');
select private.add_column('model','model_columns', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_conditions', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_order', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_rules', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_active', 'boolean', 'not null default true');
select private.add_column('model','model_source', 'text');

comment on table private.model is 'Core table for xTuple Model Definitions';
