create or replace view url as 

select
  docass_id as url_id,
  docass_source_id as url_source_id,
  docass_source_type as url_source,
  file_title as url_title,
  file_descrip as url_url,
  file_stream as url_stream
from file
  join docass on ( docass_target_id = file_id ) and ( docass_target_type = 'FILE' )
union all
select 
  docass_id as url_id,
  docass_source_id as url_source_id,
  docass_source_type as url_source,
  url_title,
  url_url,
  null as url_stream
from urlinfo
  join docass on ( docass_target_id = url_id ) and ( docass_target_type = 'URL' );

grant all on url to xtrole;

-- insert rules

create or replace rule "_INSERT" as on insert to url
  do instead nothing;

create or replace rule "_INSERT_URL" as on insert to url
  where new.url_stream is null do instead

  insert into docass (
    docass_id,
    docass_source_id,
    docass_source_type,
    docass_target_id,
    docass_target_type,
    docass_purpose )
  values (
    coalesce(new.url_id,nextval('docass_docass_id_seq')),
    new.url_source_id,
    new.url_source,
    createUrl(new.url_title, new.url_url),
    'URL',
    'S' );

create or replace rule "_INSERT_FILE" as on insert to url 
  where new.url_stream is not null do instead

  insert into docass (
    docass_id,
    docass_source_id,
    docass_source_type,
    docass_target_id,
    docass_target_type,
    docass_purpose )
  values (
    coalesce(new.url_id,nextval('docass_docass_id_seq')),
    new.url_source_id,
    new.url_source,
    createFile(new.url_title, new.url_url, new.url_stream),
    'FILE',
    'S' );

-- update rules

create or replace rule "_UPDATE" as on update to url
  do instead nothing;
  
create or replace rule "_UPDATE_URL" as on update to url 
  where new.url_stream is null do instead

update urlinfo set
  url_title = new.url_title,
  url_url = new.url_url
from docass
where ( docass_id = old.url_id )
 and ( docass_target_id = url_id )
 and ( docass_target_type = 'URL' );

create or replace rule "_UPDATE_FILE" as on update to url 
  where new.url_stream is not null do instead

update file set
  file_title = new.url_title,
  file_stream = new.url_stream
from docass
where ( docass_id = old.url_id )
 and ( docass_target_id = file_id )
 and ( docass_target_type = 'FILE' );

-- delete rules

create or replace rule "_DELETE" as on delete to url
  do instead nothing;
 
create or replace rule "_DELETE_URL" as on delete to url 
  where old.url_stream is null do instead

select deleteUrl(old.url_id);

create or replace rule "_DELETE_FILE" as on delete to url 
  where old.url_stream is not null do instead

select deleteFile(old.url_id);


