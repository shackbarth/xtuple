-- remove old trigger if any

select dropIfExists('TRIGGER', 'modelbas_changed', 'private');

-- table definition

select private.create_table('modelbas', 'private', false, 'private.model');
select private.add_column('modelbas','modelbas_nested', 'boolean', 'not null default false');
select private.add_column('modelbas','modelbas_source', 'text');
select private.add_primary_key('modelbas', 'model_id');
select private.add_constraint('modelbas', 'unique_model_name', 'unique(model_name)');

comment on table private.modelext is 'xTuple Model Base';

-- create trigger

create trigger modelbas_changed after insert or update or delete on private.modelbas for each row execute procedure private.model_changed();


