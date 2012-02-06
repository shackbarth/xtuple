-- table definition

select private.create_table('model');
select private.add_column('model','model_id', 'serial', 'primary key');
select private.add_column('model','model_name', 'text', 'not null unique');
select private.add_column('model','model_json', 'text', 'not null');
select private.add_column('model','model_active', 'boolean', 'not null default true');

comment on table private.model is 'Core table for xTuple Model Definitions';
