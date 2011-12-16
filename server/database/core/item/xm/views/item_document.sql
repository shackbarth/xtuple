select dropIfExists('VIEW', 'item_document', 'xm');

-- return rule

create or replace view xm.item_document as

-- documents assigned to items

select  
  docass_id as id,
  docass_source_id as item,
  docass_target_id as target,
  datatype_id as  target_type,
  docass_purpose as purpose
from docass 
  join private.datatype on (docass_target_type = datatype_source)
where ( docass_source_type = 'I' )

union all

-- items assigned to documents (inverse)

select  
  docass_id as id,
  docass_target_id as item,
  docass_source_id as target,
  datatype_id as target_type,
  CASE
  	WHEN docass_purpose = 'A' THEN 'C'
    WHEN docass_purpose = 'C' THEN 'A'
  ELSE docass_purpose
  END as purpose
from docass
  join private.datatype on (docass_source_type = datatype_source)
where ( docass_target_type = 'I' )

union all

-- images assigned to items

select  
  imageass_id as id,
  imageass_source_id as item,
  imageass_image_id as target,
  private.get_id('datatype','datatype_name','Image') as target_type,
  imageass_purpose as purpose
from imageass
where ( imageass_source = 'I' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.item_document
  do instead nothing;

create or replace rule "CREATE_DOC" as on insert to xm.item_document
  where new.target_type != private.get_id('datatype','datatype_name','Image')
  do instead

insert into docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.item,
  'I',
  new.target,
  (select datatype_source
    from private.datatype
     where datatype_id = new.target_type),
  new.purpose );

create or replace rule "_CREATE_IMG" as on insert to xm.item_document 
  where new.target_type = private.get_id('datatype','datatype_name','Image')
  do instead

insert into imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.id,
  new.item,
  'I',
  new.target,
  new.purpose );

-- update rule

create or replace rule "_UPDATE" as on update to xm.item_document
  do instead nothing;

create or replace rule "_DELETE" as on delete to xm.item_document
  do instead nothing;

create or replace rule "_DELETE_DOC" as on delete to xm.item_document
  where old.target_type != private.get_id('datatype','datatype_name','Image')
  do instead

delete from docass
where (docass_id = old.id);

create or replace rule "_DELETE_IMG" as on delete to xm.item_document
   where old.target_type = private.get_id('datatype','datatype_name','Image')
  do instead

delete from imageass
where (imageass_id = old.id);