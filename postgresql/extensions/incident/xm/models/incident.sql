select private.create_model(

-- Model name, schema, table

'incident', 'public', 'incdt()',

-- Columns

E'{
  "incdt.incdt_id as guid",
  "incdt.incdt_number as \\"number\\"",
  "incdt.incdt_summary as description",
  "(select account_info
    from xm.account_info
    where guid = incdt.incdt_crmacct_id) as account",
  "(select contact_info
    from xm.contact_info
    where guid = incdt.incdt_cntct_id) as contact",
  "(select user_account_info
    from xm.user_account_info
    where username = incdt.incdt_owner_username) as owner",
  "(select user_account_info
    from xm.user_account_info
    where username = incdt.incdt_assigned_username) as assigned_to",
  "incdt.incdt_descrip as notes",
  "incdt.incdt_incdtpriority_id as priority",
  "incdt.incdt_status as incident_status", 
  "incdt.incdt_public as is_public",
  "incdt.incdt_incdtresolution_id as resolution",
  "incdt.incdt_incdtseverity_id as severity",
  "(select incident_recurrence
    from xm.incident_recurrence
    where incident = incdt_id) as recurrence",
  "array(
    select incident_alarm
    from xm.incident_alarm
    where incident = incdt.incdt_id) as alarms",
  "array(
    select incident_history
    from xm.incident_history
    where incident = incdt.incdt_id) as history",
  "array(
    select incident_comment
    from xm.incident_comment
    where incident = incdt.incdt_id) as comments",
  "array(
    select incident_characteristic
    from xm.incident_characteristic
    where incident = incdt.incdt_id) as characteristics",
  "array(
    select incident_contact
    from xm.incident_contact
    where source = incdt.incdt_id) as contacts",
  "array(
    select incident_item
    from xm.incident_item
    where source = incdt.incdt_id) as items",
  "array(
    select incident_file
    from xm.incident_file
    where source = incdt.incdt_id) as files",
  "array(
    select incident_image
    from xm.incident_image
    where source = incdt.incdt_id) as images",
  "array(
    select incident_url
    from xm.incident_url
    where source = incdt.incdt_id) as urls",
  "array(
    select incident_incident
    from xm.incident_incident
    where source = incdt.incdt_id) as incidents"

    }',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident 
  do instead

insert into incdt (
  incdt_id,
  incdt_number,
  incdt_crmacct_id,
  incdt_cntct_id,
  incdt_summary,
  incdt_owner_username,
  incdt_assigned_username,
  incdt_descrip,
  incdt_incdtpriority_id,
  incdt_status,
  incdt_public,
  incdt_incdtresolution_id,
  incdt_incdtseverity_id )
values (
  new.guid,
  new.number,
  (new.account).guid,
  (new.contact).guid,
  new.description,
  (new.owner).username,
  (new.assigned_to).username,
  new.notes,
  new.priority,
  new.incident_status,
  new.is_public,
  new.resolution,
  new.severity );

","

create or replace rule \\"_CREATE_RECURRENCE\\" as on insert to xm.incident 
  where new.recurrence is null = false do instead (

insert into xm.incident_recurrence (
  guid,
  incident,
  period,
  frequency,
  start_date,
  end_date,
  maximum)
values (
  (new.recurrence).guid,
  new.guid,
  (new.recurrence).period,
  (new.recurrence).frequency,
  (new.recurrence).start_date,
  (new.recurrence).end_date,
  (new.recurrence).maximum );

)

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.incident
   where not checkPrivilege(\'MaintainAllIncidents\') 
    and not (checkPrivilege(\'MaintainPersonalIncidents\') 
             and ((new.owner).username = getEffectiveXtUser()
                  or (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to create this Incident\');

","

-- update rules

create or replace rule \\"_UPDATE\\" as on update to xm.incident
  do instead

update incdt set
  incdt_number = new.number,
  incdt_crmacct_id = (new.account).guid,
  incdt_cntct_id = (new.contact).guid,
  incdt_summary = new.description,
  incdt_owner_username = (new.owner).username,
  incdt_assigned_username = (new.assigned_to).username,
  incdt_descrip = new.notes,
  incdt_incdtpriority_id = new.priority,
  incdt_status = new.incident_status,
  incdt_public = new.is_public,
  incdt_incdtresolution_id = new.resolution,
  incdt_incdtseverity_id = new.severity
where ( incdt_id = old.guid );

","

create or replace rule \\"_UPDATE_RECURRENCE_CREATE\\" as on update to xm.incident
  where old.recurrence is null and new.recurrence is null = false do instead

insert into xm.incident_recurrence (
  guid,
  incident,
  period,
  frequency,
  start_date,
  end_date,
  maximum)
values (
  (new.recurrence).guid,
  new.guid,
  (new.recurrence).period,
  (new.recurrence).frequency,
  (new.recurrence).start_date,
  (new.recurrence).end_date,
  (new.recurrence).maximum );

","

create or replace rule \\"_UPDATE_RECURRENCE_UPDATE\\" as on update to xm.incident
  where old.recurrence != new.recurrence do instead (

update xm.incident_recurrence set
  period = (new.recurrence).period,
  frequency = (new.recurrence).frequency,
  start_date = (new.recurrence).start_date,
  end_date = (new.recurrence).end_date,
  maximum = (new.recurrence).maximum
where (guid = (old.recurrence).guid );

)

","

create or replace rule \\"_UPDATE_RECURRENCE_DELETE\\" as on update to xm.incident
  where old.recurrence is not null != new.recurrence is null do instead (

delete from xm.incident_recurrence
where ( guid = (old.recurrence).guid );

)

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.incident
   where not checkPrivilege(\'MaintainAllIncidents\') 
    and not (checkPrivilege(\'MaintainPersonalIncidents\') 
             and ((old.owner).username = getEffectiveXtUser()
                  and (new.owner).username = getEffectiveXtUser())
              or ((old.assigned_to).username = getEffectiveXtUser()
                  and (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to update this Incident\');

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident 
  do instead nothing;

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.incident
   where not checkPrivilege(\'MaintainAllIncidents\') 
    and not (checkPrivilege(\'MaintainPersonalIncidents\') 
             and ((old.owner).username = getEffectiveXtUser()
               or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to delete this Incident\');

"}',

-- Conditions, Comment, System

'{}', 'Incident Model', true, false, 'INCDT', 'IncidentNumber', 'public.incdt_incdt_id_seq');
