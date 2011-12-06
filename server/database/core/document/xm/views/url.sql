select dropIfExists('VIEW', 'url', 'xm');

-- return rule

create or replace view xm.url as 

select
  url_id as id,
  url_title as name,
  url_url as url
from urlinfo;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.url
  do instead

insert into urlinfo (
  url_id,
  url_title,
  url_url )
values (
  new.id,
  new.name,
  new.url );

-- update rule

create or replace rule "_UPDATE" as on update to xm.url
  do instead

update urlinfo set
  url_title = new.name,
  url_url = new.url
where ( url_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.url
  do instead 
  
delete from urlinfo
where ( url_id = old.id );
