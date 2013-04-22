-- table definition

select xt.create_table('orm');

-- remove old trigger if any
drop trigger if exists orm_did_change on xt.orm;

select xt.add_column('orm','orm_id', 'serial', 'primary key');
select xt.add_column('orm','orm_json', 'text', 'not null');
select xt.add_column('orm','orm_namespace', 'text', E'not null');
select xt.add_column('orm','orm_type', 'text', 'not null');
select xt.add_column('orm','orm_context', 'text', 'not null');
select xt.add_column('orm','orm_ext', 'bool', 'not null default false');
select xt.add_column('orm','orm_rest', 'bool', 'not null default false', 'xt', 'Indicates if the ORM is exposed in the REST API. Should only be set on root parent models, not their children.');
select xt.add_column('orm','orm_seq', 'integer', 'not null default 0');
select xt.add_column('orm','orm_active', 'boolean', 'not null default true');
select xt.add_constraint('orm','orm_orm_namespace_orm_type_orm_context', 'unique(orm_namespace, orm_type, orm_context)');

comment on table xt.orm is 'Core table for xTuple Object Relational Mapping Definitions';

-- create trigger

create trigger orm_did_change after insert or update or delete on xt.orm for each row execute procedure xt.orm_did_change();
