select dropIfExists('VIEW', 'file', 'xm');

-- return rule

create or replace view xm.file as 

select
  file_id as id,
  file_title as name,
  file_stream as data
from file;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.file
  do instead

insert into file (
  file_id,
  file_title,
  file_stream )
values (
  new.id,
  new.name,
  new.data );

-- update rule

create or replace rule "_UPDATE" as on update to xm.file
  do instead

update file set
  file_title = new.name
where ( file_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.file
  do instead 
  
delete from file
where ( file_id = old.id );
