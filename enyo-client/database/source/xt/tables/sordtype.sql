drop view if exists xt.sochild cascade;

-- placeholder view
create view xt.sochild as
select

  null::integer as sochild_id,
  null::text as sochild_type,
  null::uuid as sochild_uuid,
  null::text as sochild_key,
  null::text as sochild_number,
  null::character(1) as sochild_status,
  null::date as sochild_duedate,
  null::numeric(18,6) as sochild_qty;

select dropIfExists('TRIGGER', 'sordtype_did_change', 'xt');

-- Flush the current table. We rebuild it on each run.
drop table if exists xt.sordtype;

-- table definition
select xt.create_table('sordtype', 'xt');
select xt.add_column('sordtype','sordtype_id', 'serial', 'primary key', 'xt', 'The sordtype primary key.');
select xt.add_column('sordtype','sordtype_nsname', 'text', 'not null', 'xt', 'sordtype child table namespace schema');
select xt.add_column('sordtype','sordtype_tblname', 'text', 'not null', 'xt', 'sordtype child table name');
select xt.add_column('sordtype','sordtype_code', 'text', '', 'xt', 'sordtype code');
select xt.add_column('sordtype','sordtype_col_sochild_id', 'text', 'not null', 'xt', 'sordtype child table sochild_id column name');
select xt.add_column('sordtype','sordtype_col_sochild_uuid', 'text', 'not null', 'xt', 'sordtype child table sochild_uuid column name');
select xt.add_column('sordtype','sordtype_col_sochild_key', 'text', 'not null', 'xt', 'sordtype child table sochild_key column name');
select xt.add_column('sordtype','sordtype_col_sochild_number', 'text', 'not null', 'xt', 'sordtype child table sochild_number column name');
select xt.add_column('sordtype','sordtype_col_sochild_status', 'text', 'not null', 'xt', 'sordtype child table sochild_status column name');
select xt.add_column('sordtype','sordtype_col_sochild_duedate', 'text', 'not null', 'xt', 'sordtype child table sochild_duedate column name');
select xt.add_column('sordtype','sordtype_col_sochild_qty', 'text', 'not null', 'xt', 'sordtype child table sochild_qty column name');
select xt.add_column('sordtype','sordtype_joins', 'text', '', 'xt', 'sordtype child table optional joins column name');

comment on table xt.sordtype is 'Sales Order Child Type Map';

-- create trigger
create trigger sordtype_did_change after insert or update or delete on xt.sordtype for each row execute procedure xt.sordtype_did_change();
