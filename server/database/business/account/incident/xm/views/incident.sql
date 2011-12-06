select dropIfExists('VIEW', 'incident', 'xm');
-- For Testing
-- select dropIfExists('VIEW', 'incident_alarm', 'xm');
-- selecst dropIfExists('VIEW', 'incident_category', 'xm');
-- select dropIfExists('VIEW', 'incident_characteristic', 'xm');
-- select dropIfExists('VIEW', 'incident_comment', 'xm');
-- select dropIfExists('VIEW', 'incident_history', 'xm');
-- select dropIfExists('VIEW', 'incident_info', 'xm');

-- return rule

create or replace view xm.incident as 

select
  incdt_id 				           as id,
  incdt_number 			           as "number",
  incdt_crmacct_id 		           as account,
  incdt_cntct_id                   as contacts,
  incdt_summary 		           as name,
  incdt_owner_username             as owner,
  incdt_assigned_username          as assigned_to,
  CAST(incdt_timestamp AS date)    as start_date,
  null as due_date,
  null as assign_date,
  null as complete_date,
  incdt_descrip                    as notes,
  incdt_incdtpriority_id           as priority,
  rtrim(ltrim(array(
    select alarm_id 
    from alarm
    where alarm_source_id = incdt_id 
      and alarm_source = 'INCDT')::text,'{'),'}') as alarms,
  incdt_incdtcat_id as category,
  rtrim(ltrim(array(
    select charass_id 
    from charass
    where charass_target_id = incdt_id 
      and charass_target_type = 'INCDT')::text,'{'),'}') as characteristics,
  rtrim(ltrim(array(
    select comment_id 
    from comment
    where comment_source_id = incdt_id 
      and comment_source = 'INCDT')::text,'{'),'}') as comments,
  rtrim(ltrim(array(
    select incdthist_id
    from incdthist
    where incdthist_incdt_id = incdt_id )::text,'{'),'}') as history,
  incdt_status != 'L' as is_active,
  CASE incdt_status 
	   WHEN 'N' THEN 'new'
       WHEN 'F' THEN 'feedback'
       WHEN 'C' THEN 'confirmed'
       WHEN 'A' THEN 'assigned'
       WHEN 'R' THEN 'resolved'
       WHEN 'L' THEN 'closed'
     ELSE '?'
   END AS incident_status,
  incdt_public                      as is_public,
  incdt_incdtresolution_id          as resolution,  
  incdt_incdtseverity_id            as severity,
  rtrim(ltrim(array(
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
      and imageass_source = 'INCDT')::text,'{'),'}') as documents
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
	incdt_incdtseverity_id                      
 )
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
	incdt_status = CASE new.incident_status 
	   WHEN 'new' THEN 'N'
       WHEN 'feedback' THEN 'F'
       WHEN 'confirmed' THEN 'C'
       WHEN 'assigned' THEN 'A'
       WHEN 'resolved' THEN 'R'
       WHEN 'closed' THEN 'L'
       ELSE '?' END,
	incdt_public = new.is_public,
	incdt_incdtresolution_id = new.resolution,
	incdt_incdtseverity_id = new.severity
where ( incdt_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident 
  do instead (

delete from comment 
where ( comment_source_id = old.id ) 
 and ( comment_source = 'INCDT' );

delete from charass
where ( charass_target_id = old.id ) 
 and ( charass_target_type = 'INCDT' );

delete from docass
where ( docass_target_id = old.id ) 
 and ( docass_target_type = 'INCDT' );

delete from docass
where ( docass_source_id = old.id ) 
 and ( docass_source_type = 'INCDT' );

delete from imageass
where ( imageass_source_id = old.id ) 
 and ( imageass_source = 'INCDT' );

delete from incdthist 
where ( incdthist_incdt_id = old.id );

delete from incdt
where ( incdt_id = old.id );

)

