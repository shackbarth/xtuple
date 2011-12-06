insert into xm.comment_type (
  id, name, description, comments_editable, "order" )
values (
  99999, 'Kudos', 'Happy Talk', true, 0 
);

select * from xm.comment_type;

update xm.comment_type set
  name = 'Pasting',
  description = 'Mean Talk'
where id = 99999;

delete from xm.comment_type where id = 99999;
