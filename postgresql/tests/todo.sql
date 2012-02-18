--[select = return]
select * from todoitem;
select * from xm.to_do;
select * from xm.to_do where guid = 88;

select * from alarm;
select * from xm.to_do_alarm where guid = 33;

select * from comment;
select * from xm.to_do_comment where guid = 439899;

--selecting data from the parent view todo
select * from xm.to_do_info;
--end [select = return]

-- [insert into = create]
insert into xm.to_do (
   guid, name, description, to_do_status, is_active, start_date, due_date, assign_date, complete_date, notes, priority, owner, assigned_to )
values (
   88, 'Tester', 'test again', ' ' ,true, now(), now(), now(), now(), 'My new notes', 3, 
   (select user_account_info from xm.user_account_info where username = 'admin'),(select user_account_info from xm.user_account_info where username = 'admin') );

insert into xm.to_do_alarm (
   guid, number, email, email_recipient, event, event_recipient, message, message_recipient, "offset", qualifier, time, trigger, source) 
values (
	34, 22, false, 'for 88 todo', false, 'admin', false, 'negron', 23, 'da', now(), now(), ' ');

insert into xm.to_do_comment (
  guid, to_do, date, username, comment_type, text, is_public )
values (
  439899, 88880, now(), 'admin', (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'), 'Foo.', true );

-- No insert for xm.todo_info
--end [insert into = create]

--[update]
update xm.to_do set
  description = 'john is working here'
where guid = 88;

update xm.to_do_alarm set
  message = true,
  message_recipient = 'jill'
where guid = 33;

update xm.to_do_comment set
  text = 'sa##Changes have been made ##'
where guid = 439899;
-- No update for xm.todo_info
--end [update]

--[delete]
--deletes todo, comments and documents
delete from xm.to_do
where guid = 88;

delete from xm.to_do_alarm 
where guid = 33;

-- No delete for xm.todo_info
--end [delete]
