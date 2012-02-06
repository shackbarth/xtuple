-- remove old trigger if any

select dropIfExists('TRIGGER', 'modelext_changed', 'private');

-- table definition

select private.create_table('modelext', 'private', false, 'private.model');
select private.add_column('modelext','modelext_context', 'text', 'not null');
select private.add_column('modelext','modelext_seq', 'integer', 'not null default 50');
select private.add_constraint('modelext', 'model_name_modelext_context', 'unique (model_name, modelext_context)');
select private.add_primary_key('modelext', 'model_id');

comment on table private.modelext is 'xTuple Model Extension';

-- create trigger

create trigger modelext_changed after insert or update or delete on private.modelext for each row execute procedure private.model_changed();


