select dropIfExists('VIEW', 'account_info', 'xm');
select dropIfExists('VIEW', 'account', 'xm');

-- return rule

create or replace view xm.account as 

select
  crmacct_id as id,
  crmacct_number as number,
  crmacct_name as name,
  crmacct_active as is_active,
  crmacct_type as type,
  crmacct_owner_username as owner,
  crmacct_parent_id as parent,
  crmacct_notes as notes,
  crmacct_cntct_id_1 as primary_contact,
  crmacct_cntct_id_2 as secondary_contact,
  btrim(array(
    select cntct_id
    from cntct
    where cntct_crmacct_id = crmacct_id )::text,'{}') as contacts,
  btrim(array(
    select crmacctroleass_id
    from private.crmacctroleass
    where crmacctroleass_crmacct_id = crmacct_id )::text,'{}') as roles,
  btrim(array(
    select comment_id 
    from comment
    where comment_source_id = crmacct_id 
      and comment_source = 'CRMA')::text,'{}') as comments,
  btrim(array(
    select charass_id 
    from charass
    where charass_target_id = crmacct_id 
      and charass_target_type = 'CRMACCT')::text,'{}') as characteristics,
  btrim(array(
    select docass_id 
    from docass
    where docass_target_id = crmacct_id 
      and docass_target_type = 'CRMA'
    union all
    select docass_id 
    from docass
    where docass_source_id = crmacct_id 
      and docass_source_type = 'CRMA'
    union all
    select imageass_id 
    from imageass
    where imageass_source_id = crmacct_id 
      and imageass_source = 'CRMA')::text,'{}') as documents
from crmacct;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.account 
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
  crmacct_cntct_id_2 )
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
  new.secondary_contact );

-- update rule

create or replace rule "_UPDATE" as on update to xm.account
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
  crmacct_cntct_id_2 = new.secondary_contact
where ( crmacct_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.account
  do instead (

delete from private.crmacctroleass
where ( crmacctroleass_crmacct_id = old.id );

delete from comment 
where ( comment_source_id = old.id ) 
 and ( comment_source = 'CRMA' );

delete from charass
where ( charass_target_id = old.id ) 
 and ( charass_target_type = 'CRMACCT' );

delete from docass
where ( docass_target_id = old.id ) 
 and ( docass_target_type = 'CRMA' );

delete from docass
where ( docass_source_id = old.id ) 
 and ( docass_source_type = 'CRMA' );

delete from imageass
where ( imageass_source_id = old.id ) 
 and ( imageass_source = 'CRMA' );

delete from crmacct
where ( crmacct_id = old.id );

)
