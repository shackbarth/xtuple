select private.create_model(

-- Model name, schema, table

'contact', 'public', 'cntct()',

-- Columns

E'{
  "cntct.cntct_id as guid",
  "cntct.cntct_number as number",
  "cntct.cntct_active as is_active",
  "cntct.cntct_honorific as honorific",
  "cntct.cntct_first_name as first_name",
  "cntct.cntct_middle as middle_name",
  "cntct.cntct_last_name as last_name",
  "cntct.cntct_suffix as suffix",
  "cntct.cntct_title as job_title",
  "cntct.cntct_initials as initials",
  "cntct.cntct_phone as phone",
  "cntct.cntct_phone2 as alternate",
  "cntct.cntct_fax as fax",
  "cntct.cntct_email as primary_email",
  "cntct.cntct_webaddr as web_address",
  "(select user_account_info
    from xm.user_account_info
    where username = cntct.cntct_owner_username) as owner",
  "cntct.cntct_notes as notes",
  "(select address_info 
    from xm.address_info
    where guid = cntct.cntct_addr_id) as address",
  "array(
    select contact_email 
    from xm.contact_email
    where contact = cntct.cntct_id ) as email",
  "array(
    select contact_comment
    from xm.contact_comment
    where contact = cntct.cntct_id) as comments",
  "array(
    select contact_characteristic
    from xm.contact_characteristic
    where contact = cntct.cntct_id) as characteristics",
  "array(
    select contact_document
    from xm.contact_document
    where contact = cntct.cntct_id) as documents"}',
     
-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.contact 
  do instead 

insert into cntct (
  cntct_id,
  cntct_number,
  cntct_active,
  cntct_honorific,
  cntct_first_name,
  cntct_middle,
  cntct_last_name,
  cntct_suffix,
  cntct_title,
  cntct_initials,
  cntct_phone,
  cntct_phone2,
  cntct_fax,
  cntct_email,
  cntct_webaddr,
  cntct_notes,
  cntct_owner_username,
  cntct_addr_id )
values (
  new.guid,
  new.number,
  new.is_active,
  new.honorific,
  new.first_name,
  new.middle_name,
  new.last_name,
  new.suffix,
  new.job_title,
  new.initials,
  new.phone,
  new.alternate,
  new.fax,
  new.primary_email,
  new.web_address,
  new.notes,
  (new.owner).username,
  (new.address).guid );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.contact 
   where not checkPrivilege(\'MaintainAllContacts\') 
    and not (checkPrivilege(\'MaintainPersonalContacts\') 
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to create this contact\');

","

-- update rules

create or replace rule \\"_UPDATE\\" as on update to xm.contact 
  do instead

update cntct set
  cntct_number = new.number,
  cntct_active = new.is_active,
  cntct_honorific = new.honorific,
  cntct_first_name = new.first_name,
  cntct_middle = new.middle_name,
  cntct_last_name = new.last_name,
  cntct_suffix = new.suffix,
  cntct_title = new.job_title,
  cntct_initials = new.initials,
  cntct_phone = new.phone,
  cntct_phone2 = new.alternate,
  cntct_fax = new.fax,
  cntct_email = new.email,
  cntct_webaddr = new.web_address,
  cntct_notes = new.notes,
  cntct_owner_username = (new.owner).username,
  cntct_addr_id = (new.address).guid
where ( cntct_id = old.guid );

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.contact 
   where not checkPrivilege(\'MaintainAllContacts\') 
    and not (checkPrivilege(\'MaintainPersonalContacts\') 
             and (old.owner).username = getEffectiveXtUser()
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to update this contact\');

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.contact 
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
 and ( comment_source = \'T\' );

delete from charass
where ( charass_target_id = old.guid ) 
 and ( charass_target_type = \'CNTCT\' );

delete from xm.document_assignment
where ( guid = old.guid );

delete from cntct
where ( cntct_id = old.guid );

)

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.contact 
   where not checkPrivilege(\'MaintainAllContacts\') 
    and not (checkPrivilege(\'MaintainPersonalContacts\') 
             and (old.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to delete this contact\');

"}', 

-- Conditions, Comment, System

'{}', 'Contact Model', true);
