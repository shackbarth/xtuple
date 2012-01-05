--[select = return]
select * from incdt;
select * from xm.incident;
select * from xm.incident where guid = 88884;

select * from alarm;
select * from xm.incident_alarm;
select * from xm.incident_alarm where guid = 29;

select * from incdtcat;
select * from xm.incident_category;

select * from charass;
select * from xm.incident_characteristic;

select * from comment;
select * from xm.incident_comment where guid = 439856;

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
  guid, number, account, contacts, name, owner, assigned_to, start_date, notes, priority, incident_status, is_public, resolution, severity )
values (
  88884, 88884, 12, 6 ,'New name info summary here.', 'mike', 'smith', now(), 'New notes go here.' , '3' , 'C' , true , '4' , '2' );

insert into xm.incident_alarm (
   guid, number, email, email_recipient, event, event_recipient, message, message_recipient, "offset", qualifier, time, trigger, source) 
values (
	29, 15, false, 'insert email here', false, 'admin,snegron', false, 'snegron', 16, 'mb', now(), now(), ' ');

insert into xm.incident_category (
    guid, description, name, "order")
values (
     7, 'My Test 2', 'Tester', 11 );

insert into xm.incident_characteristic (
  guid, incident, characteristic, value )
values (
  88884, 88884, (select char_id from char where char_name like 'I-%' Limit 1), 'Yes' );

insert into xm.incident_comment (
  guid, incident, date, username, comment_type, text, is_public )
values (
  439856, 88884, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'General'), 'Foo.', true );

insert into xm.incident_history (
  guid, incident, timestamp, username, description)
values (
  138, 88889, now(), current_user, 'trying history to see if ok');
  
--No Insert for xm.incident_info;

insert into xm.incident_resolution (
  guid, "name", "order", description)
values (
  5, 'In Process', 4, 'In works');
  
insert into xm.incident_severity (
  guid, "name", "order", description)
values (
  6, 'VIP', 5, 'Do first');
--end [insert into = create]

--[update]
update xm.incident set
  owner = 'admin'
where guid = 88884;

update xm.incident_category set
  name = 'New Tester'
where guid = 7;

update xm.incident_alarm set
  message = true,
  message_recipient = 'john'
where guid = 29;

update xm.incident_characteristic set
  value = 'the test'
where guid = 88884;

update xm.incident_comment set
  text = 'I have updated the comments'
where guid = 439856;

--No update for xm.incident_history;

--No update for xm.incident_info;

update xm.incident_resolution set
  description = 'What works'
where guid = 5;

update xm.incident_severity set
  description = 'Last to do'
where guid = 6;

--end [update]

--[delete]

--deletes incident, history, comments, characteristic and documents
delete from xm.incident 
where guid = 88889;

delete from xm.incident_alarm 
where guid = 29;

delete from xm.incident_category
where guid = 7;

delete from xm.incident_resolution 
where guid = 5;

delete from xm.incident_severity 
where guid = 6;
--end [delete]

  
  
