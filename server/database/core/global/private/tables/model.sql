-- remove old trigger if any

select dropIfExists('TRIGGER', 'model_create_xm_view', 'private');

-- table definition
select private.create_table('model');
select private.add_column('model','model_id', 'serial', 'primary key');
select private.add_column('model','model_name', 'text', 'not null unique');
select private.add_column('model','model_comment', 'text', 'not null default ''{}''');
select private.add_column('model','model_system', 'boolean', 'not null default false');
select private.add_column('model','model_schemaname', 'text', 'not null');
select private.add_column('model','model_tablename', 'text', 'not null');
select private.add_column('model','model_columns', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_conditions', 'text[]', 'not null default ''{}''');
select private.add_column('model','model_rules', 'text[]', 'not null default ''{}''');

comment on table private.model is 'xTuple Model Definitions';

-- create trigger

create trigger model_create_xm_view after insert or update on private.model for each row execute procedure private.create_xm_view();



