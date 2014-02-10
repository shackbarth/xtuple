drop view if exists xt.obj_uuid cascade;

-- placeholder view

create view xt.obj_uuid as
select
  null::text as tblname,
  null::uuid as obj_uuid;

select dropIfExists('TRIGGER', 'obj_type_did_change', 'xt');

-- table definition

select xt.create_table('obj_type', 'xt');
select xt.add_column('obj_type','obj_type_id', 'serial', 'primary key', 'xt');
select xt.add_column('obj_type','obj_type_nsname', 'text');
select xt.add_column('obj_type','obj_type_tblname', 'text');
select xt.add_column('obj_type','obj_type_col_obj_uuid', 'text');

select xt.add_constraint('obj_type','obj_type_unique', 'unique(obj_type_nsname, obj_type_tblname, obj_type_col_obj_uuid)');

comment on table xt.obj_type is 'Obj Uuid Table Map';

-- create trigger

create trigger obj_type_did_change after insert or update or delete on xt.obj_type for each row execute procedure xt.obj_type_did_change();

delete from xt.obj_type;


