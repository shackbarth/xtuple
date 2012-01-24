select private.create_model(

-- Model name, schema, table

'opportunity', '', 'ophead',

-- Columns

E'{
  "ophead.ophead_id as guid",
  "ophead.ophead_number as number",
  "ophead.ophead_name as name",
  "ophead.ophead_active as is_active",
  "(select account_info
    from xm.account_info
    where guid = ophead.ophead_crmacct_id) as account",
  "(select contact_info
    from xm.contact_info
    where guid = ophead.ophead_cntct_id) as contact",
  "ophead.ophead_opstage_id as stage",
  "ophead.ophead_priority_id as priority",
  "ophead.ophead_opsource_id as source",
  "ophead.ophead_optype_id as opportunity_type",
  "ophead.ophead_amount as amount",
  "ophead.ophead_curr_id as currency",
  "ophead.ophead_probability_prcnt as probability",
  "ophead.ophead_start_date as start_date",
  "ophead.ophead_assigned_date as assign_date",
  "ophead.ophead_actual_date as target_close",
  "ophead.ophead_target_date as actual_close",
  "ophead.ophead_notes as notes",
  "(select user_account_info
    from xm.user_account_info
    where username = ophead.ophead_owner_username) as owner",
  "(select user_account_info
    from xm.user_account_info
    where username = ophead.ophead_username) as assigned_to",
  "array(
    select opportunity_comment
    from xm.opportunity_comment
    where opportunity = ophead.ophead_id) as comments",
  "array(
    select opportunity_characteristic
    from xm.opportunity_characteristic
    where opportunity = ophead.ophead_id) as characteristics",
  "array(
    select opportunity_characteristic
    from xm.opportunity_characteristic
    where opportunity = ophead.ophead_id) as documents"}',

E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity
  do instead

insert into ophead (
  ophead_id,
  ophead_crmacct_id,
  ophead_amount,
  ophead_cntct_id,
  ophead_curr_id,
  ophead_probability_prcnt,
  ophead_opsource_id,
  ophead_opstage_id,
  ophead_optype_id,
  ophead_assigned_date,
  ophead_username,
  ophead_actual_date,
  ophead_target_date,
  ophead_active,
  ophead_name,
  ophead_notes,
  ophead_owner_username,
  ophead_priority_id,
  ophead_start_date,
  ophead_number )
values (
  new.guid,
  (new.account).guid,
  new.amount,
  (new.contact).guid,
  new.currency,
  new.probability,
  new.source,
  new.stage,
  new.opportunity_type,
  new.assign_date,
  (new.assigned_to).username,
  new.actual_close,
  new.target_close,
  new.is_active,
  new.name,
  new.notes,
  (new.owner).username,
  new.priority,
  new.start_date,
  new.number)

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.opportunity
   where not checkPrivilege(\'MaintainAllOpportunities\') 
    and not (checkPrivilege(\'MaintainPersonalOpportunities\') 
             and ((new.owner).username = getEffectiveXtUser()
                  or (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to create this Opportunity\');

","

-- update rule
create or replace rule \\"_UPDATE\\" as on update to xm.opportunity
  do instead

update ophead set
  ophead_crmacct_id = (new.account).guid,
  ophead_amount = new.amount,
  ophead_cntct_id = (new.contact).guid,
  ophead_curr_id = new.currency,
  ophead_probability_prcnt = new.probability,
  ophead_opsource_id = new.source,
  ophead_opstage_id = new.stage,
  ophead_optype_id = new.opportunity_type,
  ophead_assigned_date = new.assign_date,
  ophead_username = (new.assigned_to).username,
  ophead_actual_date = new.actual_close,
  ophead_target_date = new.target_close,
  ophead_active = new.is_active,
  ophead_name = new.name,
  ophead_notes = new.notes,
  ophead_owner_username = (new.owner).username,
  ophead_priority_id = new.priority,
  ophead_start_date = new.start_date
 where ( ophead_id = old.guid )

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.opportunity
   where not checkPrivilege(\'MaintainAllOpportunuties\') 
    and not (checkPrivilege(\'MaintainPersonalOpportunuties\') 
             and ((old.owner).username = getEffectiveXtUser()
                  and (new.owner).username = getEffectiveXtUser())
              or ((old.assigned_to).username = getEffectiveXtUser()
                  and (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to update this Opportunity\');

","


-- delete rule
create or replace rule \\"_DELETE\\" as on delete to xm.opportunity
  do instead (

delete from \\"comment\\"
where ( comment_source_id = old.guid 
 and comment_source = \'OPP\' );

delete from charass
where ( charass_target_id = old.guid ) 
  and ( charass_target_type = \'OPP\' );

delete from docass
where ( docass_target_id = old.guid ) 
  and ( docass_target_type = \'OPP\' );

delete from docass
where ( docass_source_id = old.guid ) 
  and ( docass_source_type = \'OPP\' );

delete from imageass
where ( imageass_source_id = old.guid ) 
  and ( imageass_source = \'OPP\' );

delete from ophead
where ( ophead_id = old.guid );

)

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.opportunity
   where not checkPrivilege(\'MaintainAllOpportunites\') 
    and not (checkPrivilege(\'MaintainPersonalOpportunites\') 
             and ((old.owner).username = getEffectiveXtUser()
               or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to delete this Opportunites\');

"}',

-- Conditions, Comment, System

'{}', 'Opportunity Model', true);
