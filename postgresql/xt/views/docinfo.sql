create or replace view xt.docinfo as 

   select
    docass_id as id,
    docass_source_type as source_type,
    docass_source_id as source_id,
    docass_target_type as target_type,
    docass_target_id as target_id,
    docass_purpose as purpose
   from docass
   union all
   -- (inverse)
   select
    docass_id as id,
    docass_target_type as source_type,
    docass_target_id as source_id,
    docass_source_type target_type,
    docass_source_id as target_id,
    case 
     when docass_purpose = 'A' then 'C'
     when docass_purpose = 'C' then 'A'
     else docass_purpose
    end as purpose
   from public.docass
   union all
   -- images
   select
    imageass_id as id,
    imageass_source as source_type,
    imageass_source_id as source_id,
    'IMG' as target_type,
    imageass_image_id as target_id,
    imageass_purpose as purpose
   from imageass;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.docinfo
  do instead nothing;


create or replace rule "_CREATE_DOC" as on insert to xt.docinfo
  where new.target_type != 'IMG' do instead

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.source_id,
  new.source_type,
  new.target_id,
  new.target_type,
  new.purpose );
  
create or replace rule "_CREATE_IMG" as on insert to xt.docinfo
  where new.target_type = 'IMG' do instead

insert into public.imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.id,
  new.source_id,
  new.source_type,
  new.target_id,
  new.purpose );

-- update rule

create or replace rule "_UPDATE" as on update to xt.docinfo
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xt.docinfo
  do instead nothing;
  
create or replace rule "_DELETE_DOC" as on delete to xt.docinfo
  where old.target_type != 'IMG' do instead

delete from public.docass 
where ( docass_id = old.id );

create or replace rule "_DELETE_IMG" as on delete to xt.docinfo
  where old.target_type = 'IMG' do instead

delete from public.imageass
where ( imageass_id = old.id );
