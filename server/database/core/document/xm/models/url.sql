select private.create_model(

-- Model name, schema, table

'url', 'public', 'urlinfo',

-- Columns

E'{
  "urlinfo.url_id as guid",
  "urlinfo.url_title as name",
  "urlinfo.url_url as url"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.url
  do instead

insert into urlinfo (
  url_id,
  url_title,
  url_url )
values (
  new.guid,
  new.name,
  new.url );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.url
  do instead

update urlinfo set
  url_title = new.name,
  url_url = new.url
where ( url_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.url
  do instead 
  
delete from urlinfo
where ( url_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'URL Model', true);
