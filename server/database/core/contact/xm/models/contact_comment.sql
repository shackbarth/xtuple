select private.create_model(

-- Model name, schema, table

'contact_comment', 'xm', 'comments',

-- Columns

E'{
  "comments.guid as guid",
  "comments.source_id as contact",
  "comments.date as date",
  "comments.username as username",
  "comments.comment_type as comment_type",
  "comments.text as text",
  "comments.is_public as is_public",
  "comments.can_update as can_update"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.contact_comment 
  do instead

insert into xm.comments (
  guid,
  source_id,
  source,
  date,
  username,
  comment_type,
  text,
  is_public )
values (
  new.guid,
  new.contact,
  \'T\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_comment 
  do instead

update xm.comments set
  text = new.text,
  is_public = new.is_public
where ( guid = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.contact_comment 
  do instead nothing;

"}', 

-- Conditions, Comment, System, Nested
E'{"comments.source = \'T\'"}', 'Contact Comment Model', true, true);
