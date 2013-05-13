--- This is to deal with crazy problem where customer documents are really account documents... most of the time
select xt.create_view('xt.cust_doc', $$

       select 
        docass_id as id, 
        crmacct_cust_id as source_id, 
        docass_target_type as target_type, 
        docass_target_id as target_id, 
        docass_purpose as purpose, 
        obj_uuid  
       from docass, crmacct 
       where docass_source_type = 'CRMA' 
         and crmacct_id = docass_source_id 
         and crmacct_cust_id is not null 
       union all 
       -- (inverse)
       select 
        docass_id as id, 
        crmacct_cust_id as source_id, 
        docass_source_type target_type, 
        docass_source_id as target_id, 
        case  
         when docass_purpose = 'A' then 'C' 
         when docass_purpose = 'C' then 'A' 
         else docass_purpose 
        end as purpose, 
       obj_uuid  
       from docass, crmacct 
       where docass_target_type = 'CRMA' 
         and crmacct_id = docass_target_id 
         and crmacct_cust_id is not null 
       union all 
       -- (inverse cust)
       select 
        docass_id as id, 
        docass_target_id as source_id, 
        docass_source_type target_type, 
        docass_source_id as target_id, 
        case  
         when docass_purpose = 'A' then 'C' 
         when docass_purpose = 'C' then 'A' 
         else docass_purpose 
        end as purpose, 
       obj_uuid  
       from docass 
       where docass_target_type = 'C'

$$, false);

-- insert rules

create or replace rule "_CREATE" as on insert to xt.cust_doc
  do instead 

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose,
  obj_uuid )
select
  new.id,
  crmacct_id,
  'CRMA',
  new.target_id,
  new.target_type,
  new.purpose,
  new.obj_uuid
from crmacct
where crmacct_cust_id = NEW.source_id;
  
-- update rule

create or replace rule "_UPDATE" as on update to xt.cust_doc
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xt.cust_doc
  do instead 

delete from public.docass 
where ( docass_id = old.id );
