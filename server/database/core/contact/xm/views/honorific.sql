select dropIfExists('VIEW', 'honorific', 'xm');

-- return rule

create or replace view xm.honorific as 

select
  hnfc_id as id,
  hnfc_code as code
from public.hnfc;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.honorific
  do instead

insert into public.hnfc (
  hnfc_id,
  hnfc_code )
values (
  new.id,
  new.code );

-- update rule

create or replace rule "_UPDATE" as on update to xm.honorific
  do instead

update public.hnfc set
  hnfc_code = new.code
where ( hnfc_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.honorific
  do instead 
  
delete from public.hnfc
where ( hnfc_id = old.id );
