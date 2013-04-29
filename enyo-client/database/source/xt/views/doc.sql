DO $$
  var dropSql = "drop view if exists xt.doc cascade;";
  var sql = "create or replace view xt.doc as " + 
   "select " +
    "docass_id as id, " +
    "docass_source_type as source_type, " +
    "docass_source_id as source_id, " +
    "docass_target_type as target_type, " +
    "docass_target_id as target_id, " +
    "docass_purpose as purpose, " +
    "obj_uuid " +
   "from docass " +
   "union all " +
   /* (inverse) */
   "select " +
    "docass_id as id, " +
    "docass_target_type as source_type, " +
    "docass_target_id as source_id, " +
    "docass_source_type target_type, " +
    "docass_source_id as target_id, " +
    "case  " +
     "when docass_purpose = 'A' then 'C' " +
     "when docass_purpose = 'C' then 'A' " +
     "else docass_purpose " +
    "end as purpose, " +
    "obj_uuid " +
   "from public.docass; ";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.doc to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.doc
  do instead 

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.source_id,
  new.source_type,
  new.target_id,
  new.target_type,
  new.purpose );
  
-- update rule

create or replace rule "_UPDATE" as on update to xt.doc
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xt.doc
  do instead 

delete from public.docass 
where ( docass_id = old.id );
