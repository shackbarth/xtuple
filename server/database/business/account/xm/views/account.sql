select private.create_model(

-- Model name, schema, table

'account', 'public', 'crmacct',

-- Columns

E'{
  "crmacct.crmacct_id as id",
  "crmacct.crmacct_number as number",
  "crmacct.crmacct_name as name",
  "crmacct.crmacct_active as is_active",
  "crmacct.crmacct_type as type",
  "crmacct.crmacct_owner_username as owner",
  "crmacct.crmacct_parent_id as parent",
  "crmacct.crmacct_notes as notes",
  "crmacct.crmacct_cntct_id_1 as primary_contact",
  "crmacct.crmacct_cntct_id_2 as secondary_contact",
  "crmacct.crmacct_usr_username as user",
 "btrim(array(
    select comment_id 
    from comment
    where comment_source_id = crmacct.crmacct_id 
      and comment_source = \'CRMA\')::text,\'{}\') as comments",
  "btrim(array(
    select charass_id 
    from charass
    where charass_target_id = crmacct.crmacct_id 
      and charass_target_type = \'CRMACCT\')::text,\'{}\') as characteristics",
  "btrim(array(
    select docass_id 
    from docass
    where docass_target_id = crmacct.crmacct_id 
      and docass_target_type = \'CRMA\'
    union all
    select docass_id 
    from docass
    where docass_source_id = crmacct.crmacct_id 
      and docass_source_type = \'CRMA\'
    union all
    select imageass_id 
    from imageass
    where imageass_source_id = crmacct.crmacct_id 
      and imageass_source = \'CRMA\')::text,\'{}\') as documents"
}',

-- Rules
E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.account 
  do instead

insert into crmacct (
  crmacct_id,
  crmacct_number,
  crmacct_name,
  crmacct_active,
  crmacct_type,
  crmacct_owner_username,
  crmacct_parent_id,
  crmacct_notes,
  crmacct_cntct_id_1,
  crmacct_cntct_id_2,
  crmacct_usr_username )
values (
  new.id,
  new.number,
  new.name,
  new.is_active,
  new.type,
  new.owner,
  new.parent,
  new.notes,
  new.primary_contact,
  new.secondary_contact,
  new.user );

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account
  do instead

update crmacct set
  crmacct_number = new.number,
  crmacct_name = new.name,
  crmacct_active = new.is_active,
  crmacct_type = new.type,
  crmacct_owner_username = new.owner,
  crmacct_parent_id = new.parent,
  crmacct_notes = new.notes,
  crmacct_cntct_id_1 = new.primary_contact,
  crmacct_cntct_id_2 = new.secondary_contact,
  crmacct_usr_username = new.user
where ( crmacct_id = old.id );

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.account
  do instead (

delete from comment 
where ( comment_source_id = old.id ) 
 and ( comment_source = \'CRMA\' );

delete from charass
where ( charass_target_id = old.id ) 
 and ( charass_target_type = \'CRMACCT\' );

delete from docass
where ( docass_target_id = old.id ) 
 and ( docass_target_type = \'CRMA\' );

delete from docass
where ( docass_source_id = old.id ) 
 and ( docass_source_type = \'CRMA\' );

delete from imageass
where ( imageass_source_id = old.id ) 
 and ( imageass_source = \'CRMA\' );

delete from crmacct
where ( crmacct_id = old.id );

)"}',

-- Conditions, Comment, System
'{}', 'Account Model', true);
