-- remove old trigger if any

select dropIfExists('TRIGGER', 'modelext_create_xm_view', 'private');

-- table definition

select private.create_table('modelext', 'private', false, 'private.model');
select private.add_column('modelext','modelext_seq', 'integer', 'not null default 50');
select private.add_column('modelext','modelext_join_type', 'text');
select private.add_column('modelext','modelext_join_clause', 'text');

comment on table private.modelext is 'xTuple Model Extension';

-- create trigger

create trigger modelext_create_xm_view after insert or update on private.model for each row execute procedure private.create_xm_view();


