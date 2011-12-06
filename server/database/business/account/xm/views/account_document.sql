select dropIfExists('VIEW', 'account_document', 'xm');

-- select rule

create or replace view xm.account_document as 

-- documents assigned to account
select
  docass_id as id,
  docass_source_id as account,
  docass_target_id as target,
  datatype_id as target_type,
  docass_purpose as purpose
from docass
  join private.datatype on ( docass_target_type = datatype_source )
where ( docass_source_type = 'CRMA' )
union all
-- accounts assigned to documents (inverse)
select
  docass_id as id,
  docass_target_id as account,
  docass_source_id as target,
  datatype_id as target_type,
  case 
    when docass_purpose = 'A' then 'C'
    when docass_purpose = 'C' then 'A'
    else docass_purpose
  end as purpose
from docass
  join private.datatype on ( docass_source_type = datatype_source )
where ( docass_target_type = 'CRMA' )
union all
-- images assigned to account
select
  imageass_id as id,
  imageass_source_id as account,
  imageass_id as target,
  datatype_id as target_type,
  imageass_purpose as purpose
from imageass, private.datatype
where ( imageass_source = 'CRMA' )
 and (  datatype_source = 'IMG' );

-- insert rules

create or replace rule "_CREATE" as on insert to xm.account_document 
  do instead nothing;
  
create or replace rule "_CREATE_DOC" as on insert to xm.account_document 
  where new.target_type != private.get_id('datatype', 'datatype_name', 'Image') do instead

insert into docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.account,
  'CRMA',
  new.target,
  new.target_type,
  new.purpose );

create or replace rule "_CREATE_IMG" as on insert to xm.account_document 
  where new.target_type = private.get_id('datatype', 'datatype_name', 'Image') do instead

insert into imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.id,
  new.account,
  'CRMA',
  new.target,
  new.purpose );

-- update rule

create or replace rule "_UPDATE" as on update to xm.account_document 
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.account_document
  do instead nothing;
  
create or replace rule "_DELETE_DOC" as on delete to xm.account_document
  where old.target_type != private.get_id('datatype', 'datatype_name', 'Image') do instead

delete from docass 
where ( docass_id = old.id );

create or replace rule "_DELETE_IMG" as on delete to xm.account_document
  where old.target_type = private.get_id('datatype', 'datatype_name', 'Image') do instead

delete from imageass
where ( imageass_id = old.id );



