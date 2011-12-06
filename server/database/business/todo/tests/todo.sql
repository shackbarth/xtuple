--[select = return]
select * from todoitem;
select * from xm.todo;
select * from xm.todo where id = 88;

select * from alarm;
select * from xm.todo_alarm where id = 33;

select * from comment;
select * from xm.todo_comment where id = 439899;

--selecting data from the parent view todo
select * from xm.todo_info;
--end [select = return]

-- [insert into = create]
insert into xm.todo (
   id, name, description, todo_status, is_active, start_date, due_date, assign_date, complete_date, notes, priority, owner, assigned_to )
values (
   88, 'Tester', 'test again', ' ' ,true, now(), now(), now(), now(), 'My new notes', 3, current_user, current_user );

insert into xm.todo_alarm (
   id, number, email, email_recipient, event, event_recipient, message, message_recipient, "offset", qualifier, time, trigger, source) 
values (
	34, 22, false, 'for 88 todo', false, 'admin', false, 'negron', 23, 'da', now(), now(), ' ');

insert into xm.todo_comment (
  id, todo, date, username, comment_type, text, is_public )
values (
  439899, 88880, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'General'), 'Foo.', true );

-- No insert for xm.todo_info
--end [insert into = create]

--[update]
update xm.todo set
  description = 'john is working here'
where id = 88;

update xm.todo_alarm set
  message = true,
  message_recipient = 'jill'
where id = 33;

update xm.todo_comment set
  text = 'sa##Changes have been made ##'
where id = 439899;
-- No update for xm.todo_info
--end [update]

--[delete]
--deletes todo, comments and documents
delete from xm.todo
where id = 88;

delete from xm.todo_alarm 
where id = 33;

-- No delete for xm.todo_info
--end [delete]