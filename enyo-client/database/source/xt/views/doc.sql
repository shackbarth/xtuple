select xt.create_view('xt.doc', $$

   select  
    docass_id as id,  
    docass_source_type as source_type,  
    docass_source_id as source_id,  
    docass_target_type as target_type,  
    docass_target_id as target_id,  
    docass_purpose as purpose,  
    obj_uuid  
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
    end as purpose,  
    obj_uuid  
   from public.docass; ;

$$, false);

-- insert rules

create or replace rule "_CREATE" as on insert to xt.doc
  do instead 

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose,
  obj_uuid )
values (
  new.id,
  new.source_id,
  new.source_type,
  new.target_id,
  new.target_type,
  new.purpose,
  new.obj_uuid );
  
-- update rule

create or replace rule "_UPDATE" as on update to xt.doc
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xt.doc
  do instead 

delete from public.docass 
where ( docass_id = old.id );
