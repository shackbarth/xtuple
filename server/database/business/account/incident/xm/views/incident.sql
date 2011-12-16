select dropIfExists('VIEW', 'incident', 'xm');
select dropIfExists('VIEW', 'incident_info', 'xm');

-- return rule

create or replace view xm.incident as 

select
  incdt_id as id,
  incdt_number as "number",
  incdt_crmacct_id as account,
  incdt_cntct_id as contacts,
  incdt_summary as "name",
  incdt_owner_username as "owner",
  incdt_assigned_username as assigned_to,
  cast(incdt_timestamp AS date) as start_date,
  null::date as due_date,
  null::date as assign_date,
  null::date as complete_date,
  incdt_descrip as notes,
  incdt_incdtpriority_id as priority,
  btrim(array(
  select alarm_id 
  from alarm
  where alarm_source_id = incdt_id 
    and alarm_source = 'INCDT')::text,'{}') as alarms,
  btrim(array(
  select charass_id 
  from charass
  where charass_target_id = incdt_id 
    and charass_target_type = 'INCDT')::text,'{}') as characteristics,
  btrim(array(
  select comment_id
  from "comment"
  where comment_source_id = incdt_id
    and comment_source = 'INCDT')::text,'{}') as "comments",  
  btrim(array(
  select incdthist_id
  from incdthist
  where incdthist_incdt_id = incdt_id)::text,'{}') as history,  
  incdt_status != 'L' as is_active,
  case incdt_status 
  when 'N' then 'new'
     when 'F' then 'feedback'
     when 'C' then 'confirmed'
     when 'A' then 'assigned'
     when 'R' then 'resolved'
     when 'L' then 'closed'
  else '?'
   end as incident_status,
  incdt_public as is_public,
  incdt_incdtresolution_id as resolution,  
  incdt_incdtseverity_id as severity,
  btrim(array(
  select docass_id 
  from docass
  where docass_target_id = incdt_id 
    and docass_target_type = 'INCDT'
  union all
  select docass_id 
  from docass
  where docass_source_id = incdt_id 
    and docass_source_type = 'INCDT'
  union all
  select imageass_id 
  from imageass
  where imageass_source_id = incdt_id 
    and imageass_source = 'INCDT')::text,'{}') as documents
from incdt;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.incident 
  do instead

insert into incdt (
  incdt_id,
  incdt_number,
  incdt_crmacct_id,
  incdt_cntct_id,
  incdt_summary,
  incdt_owner_username,
  incdt_assigned_username,
  incdt_timestamp,
  incdt_descrip,
  incdt_incdtpriority_id,
  incdt_status,
  incdt_public,
  incdt_incdtresolution_id,
  incdt_incdtseverity_id )
values (
  new.id,
  new.number,
  new.account,
  new.contacts,
  new.name,
  new.owner,
  new.assigned_to,
  new.start_date,
  new.notes,
  new.priority,
  new.incident_status,
  new.is_public,
  new.resolution,
  new.severity );

-- update rule

create or replace rule "_UPDATE" as on update to xm.incident
  do instead

update incdt set
  incdt_number = new.number,
  incdt_crmacct_id = new.account,
  incdt_cntct_id = new.contacts,
  incdt_summary = new.name,
  incdt_owner_username = new.owner,
  incdt_assigned_username = new.assigned_to,
  incdt_timestamp = new.start_date,
  incdt_descrip = new.notes,
  incdt_incdtpriority_id = new.priority,
  incdt_status = case new.incident_status 
         when 'new' then 'N'
        when 'feedback' then 'F'
        when 'confirmed' then 'C'
        when 'assigned' then 'A'
        when 'resolved' then 'R'
        when 'closed' then 'L'
        else '?' 
       end,
  incdt_public = new.is_public,
  incdt_incdtresolution_id = new.resolution,
  incdt_incdtseverity_id = new.severity
where ( incdt_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident 
  do instead nothing;

