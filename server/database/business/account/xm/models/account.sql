select private.create_model(

-- Model name, schema, table

'account', 'public', 'crmacct',

-- Columns

E'{
  "crmacct.crmacct_id as guid",
  "crmacct.crmacct_number as number",
  "crmacct.crmacct_name as name",
  "crmacct.crmacct_active as is_active",
  "crmacct.crmacct_type as type",
  "(select account_info
    from xm.account_info
    where (guid = crmacct.crmacct_parent_id)) as parent",
  "crmacct.crmacct_notes as notes",
  "(select contact_info
    from xm.contact_info
    where (guid = crmacct.crmacct_cntct_id_1)) as primary_contact",
  "(select contact_info
    from xm.contact_info
    where (guid = crmacct.crmacct_cntct_id_2)) as secondary_contact",
  "(select user_account_info
    from xm.user_account_info
    where (username = crmacct.crmacct_usr_username)) as user_account",
  "(select user_account_info
   from xm.user_account_info
   where username = crmacct.crmacct_owner_username) as owner",
  "array(
    select account_comment 
    from xm.account_comment
    where (account = crmacct.crmacct_id)) as comments",
  "array(
    select account_characteristic 
    from xm.account_characteristic
    where (account = crmacct.crmacct_id)) as characteristics",
  "array(
    select account_document 
    from xm.account_document
    where (account = crmacct.crmacct_id)) as documents"
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
  new.guid,
  new.number,
  new.name,
  new.is_active,
  new.type,
  (new.owner).username,
  (new.parent).guid,
  new.notes,
  (new.primary_contact).guid,
  (new.secondary_contact).guid,
  (new.user_account).username );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.account 
   where not checkPrivilege(\'MaintainAllCRMAccounts\') 
    and not (checkPrivilege(\'MaintainPersonalCRMAccounts\') 
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to create this Account\');

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account
  do instead

update crmacct set
  crmacct_number = new.number,
  crmacct_name = new.name,
  crmacct_active = new.is_active,
  crmacct_type = new.type,
  crmacct_owner_username = (new.owner).username,
  crmacct_parent_id = (new.parent).guid,
  crmacct_notes = new.notes,
  crmacct_cntct_id_1 = (new.primary_contact).guid,
  crmacct_cntct_id_2 = (new.secondary_contact).guid,
  crmacct_usr_username = (new.user_account).username
where ( crmacct_id = old.guid );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on update to xm.account 
   where not checkPrivilege(\'MaintainAllCRMAccounts\') 
    and not (checkPrivilege(\'MaintainPersonalCRMAccounts\')
	     and (old.owner).username = getEffectiveXTUser()
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to update this Account\');

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.account
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
 and ( comment_source = \'CRMA\' );

delete from charass
where ( charass_target_id = old.guid ) 
 and ( charass_target_type = \'CRMACCT\' );

delete from xm.document_assignment
where ( id = old.guid );

delete from crmacct
where ( crmacct_id = old.guid );

)

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on delete to xm.account 
   where not checkPrivilege(\'MaintainAllCRMAccounts\') 
    and not (checkPrivilege(\'MaintainPersonalCRMAccounts\') 
             and (old.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to delete this Account\');

"}',

-- Conditions, Comment, System
E'{"checkPrivilege(\'ViewAllCRMAccounts\')", "checkPrivilege(\'ViewPersonalCRMAccounts\')"}', 'Account Model', true);
