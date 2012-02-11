-- table definition

-- remove old trigger if any

select dropIfExists('TRIGGER', 'orm_did_change', 'private');

select private.create_table('orm');
select private.add_column('orm','orm_id', 'serial', 'primary key');
select private.add_column('orm','orm_name', 'text', 'not null');
select private.add_column('orm','orm_context', 'text', 'not null');
select private.add_column('orm','orm_json', 'text', 'not null');
select private.add_column('orm','orm_ext', 'bool', 'not null default false');
select private.add_column('orm','orm_seq', 'integer', 'not null default 0');
select private.add_column('orm','orm_active', 'boolean', 'not null default true');
select private.add_constraint('orm','orm_orm_name_orm_context', 'unique(orm_name, orm_context)');

comment on table private.orm is 'Core table for xTuple Object Relational Mapping Definitions';

-- create trigger

create trigger orm_did_change after insert or update or delete on private.orm for each row execute procedure private.orm_did_change();
