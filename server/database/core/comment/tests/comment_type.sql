insert into xm.comment_type (
  guid, name, description, comments_editable, "order" )
values (
  99999, 'Kudos', 'Happy Talk', true, 0 
);

select * from xm.comment_type;

update xm.comment_type set
  name = 'Pasting',
  description = 'Mean Talk'
where guid = 99999;

delete from xm.comment_type where guid = 99999;
