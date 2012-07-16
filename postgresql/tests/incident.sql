--[select = return]
select * from incdt;
select * from xm.incident;
select * from xm.incident where id = 88884;

select * from alarm;
select * from xm.incident_alarm;
select * from xm.incident_alarm where id = 29;

select * from incdtcat;
select * from xm.incident_category;

select * from charass;
select * from xm.incident_characteristic;

select * from comment;
select * from xm.incident_comment where id = 439856;

select * from incdthist;
select * from xm.incident_history where incident = 88884;

select * from xm.incident_info;

select * from incdtresolution;
select * from xm.incident_resolution;

select * from incdtseverity;
select * from xm.incident_severity;
--end [select = return]

-- [insert into = create]
insert into xm.incident (
  id, number, account, contact, description, owner, assigned_to, notes, priority, incident_status, is_public, resolution, severity, 
  recurrence_period, recurrence_frequency, recurrence_start, recurrence_end, recurrence_max )
values (
  88884, 88884, (select account_info from xm.account_info where id = 12), 
  (select contact_info from xm.contact_info where id = 6) ,'New name info summary here.', 
  (select user_account_info from xm.user_account_info where username='admin'), null, 
  'New notes go here.' , '3' , 'C' , true , '4' , '2', 
  'W', 1, (current_date + 2)::timestamp with time zone, null, 2
   );

-- remove the recurrance

update xm.incident set
  recurrence_period = null
where id = 88884;

-- add a new recurrance
update xm.incident set
  recurrence_period = 'M', 
  recurrence_frequency = 1, 
  recurrence_start = (current_date + 4)::timestamp with time zone, 
  recurrence_end = null,
  recurrence_max = 2
where id = 88884;

-- update the recurrance

update xm.incident set
  recurrence_period = 'D', 
  recurrence_frequency = 2, 
  recurrence_start = (current_date + 2)::timestamp with time zone, 
  recurrence_end = null,
  recurrence_max = 3
where id = 88884;

insert into xm.incident_alarm (
   id, number, email, email_recipient, event, event_recipient, message, message_recipient, "offset", qualifier, time, trigger, source) 
values (
	29, 15, false, 'insert email here', false, 'admin,snegron', false, 'snegron', 16, 'mb', now(), now(), ' ');

insert into xm.incident_category (
    id, description, name, "order")
values (
     7, 'My Test 2', 'Tester', 11 );

insert into xm.incident_characteristic (
  id, incident, characteristic, value )
values (
  88884, 88884, (select characteristic from xm.characteristic where name like 'I-%' Limit 1), 'Yes' );

insert into xm.incident_comment (
  id, incident, date, username, comment_type, text, is_public )
values (
  439856, 88884, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'), 'Foo.', true );

insert into xm.incident_history (
  id, incident, timestamp, username, description)
values (
  138, 88884, now(), current_user, 'trying history to see if ok');
  
--No Insert for xm.incident_info;

insert into xm.incident_resolution (
  id, "name", "order", description)
values (
  5, 'In Process', 4, 'In works');
  
insert into xm.incident_severity (
  id, "name", "order", description)
values (
  6, 'VIP', 5, 'Do first');
--end [insert into = create]

--[update]
update xm.incident set
  assigned_to = (select user_account_info from xm.user_account_info where username= 'admin')
where id = 88884;

update xm.incident_category set
  name = 'New Tester'
where id = 7;

update xm.incident_alarm set
  message = true,
  message_recipient = 'john'
where id = 29;

update xm.incident_characteristic set
  value = 'the test'
where id = 88884;

update xm.incident_comment set
  text = 'I have updated the comments'
where id = 439856;

--No update for xm.incident_history;

--No update for xm.incident_info;

update xm.incident_resolution set
  description = 'What works'
where id = 5;

update xm.incident_severity set
  description = 'Last to do'
where id = 6;

--end [update]

--[delete]

--deletes incident, history, comments, characteristic and documents
delete from comment where comment_source = 'INCDT' and comment_source_id=88884;
delete from charass where charass_target_type = 'INCDT' and charass_target_id=88884;
delete from recur where recur_parent_type='INCDT' and recur_parent_id=88884;
delete from incdthist where incdthist_incdt_id=88884;
delete from incdt where incdt_id = 88884;

delete from xm.incident_alarm 
where id = 29;

delete from xm.incident_category
where id = 7;

delete from xm.incident_resolution 
where id = 5;

delete from xm.incident_severity 
where id = 6;
--end [delete]

  
  
