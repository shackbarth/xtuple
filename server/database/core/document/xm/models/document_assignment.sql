select private.create_model(

-- Model name, schema

'document_assignment', '', 

-- table

E'(select
    docass_id as id,
    docass_source_id as source_id,
    docass_source_type as source_type,
    docass_target_id as target_id,
    tt.model_id as target_type,
    docass_purpose as purpose
   from docass
     join private.modelbas tt on ( docass_target_type = tt.modelbas_source )
   union all
   -- (inverse)
   select
    docass_id as id,
    docass_target_id as source_id,
    docass_source_type source_type,
    docass_source_id as target_id,
    tt.model_id as target_type,
    case 
     when docass_purpose = \'A\' then \'C\'
     when docass_purpose = \'C\' then \'A\'
     else docass_purpose
    end as purpose
   from public.docass
     join private.modelbas tt on ( docass_source_type = tt.modelbas_source )
   union all
   -- images
   select
    imageass_id as id,
    imageass_source_id as source_id,
    imageass_source as source_type,
    imageass_id as target_id,
    tt.model_id as target_type,
    imageass_purpose as purpose
   from imageass, private.modelbas tt
   where (tt.modelbas_source = \'IMG\')) documents',

-- Columns

E'{
  "documents.id as id",
  "documents.source_id as source",
  "documents.source_type as source_type",
  "documents.target_id as target",
  "documents.target_type as target_type",
  "documents.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.document_assignment 
  do instead nothing;

","

create or replace rule \\"_CREATE_DOC\\" as on insert to xm.document_assignment 
  where new.target_type != private.get_id(\'modelbas\', \'model_name\', \'image\') do instead

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.source,
  new.source_type,
  new.target,
  private.get_model_source(new.target_type),
  new.purpose );

","

create or replace rule \\"_CREATE_IMG\\" as on insert to xm.document_assignment 
  where new.target_type = private.get_id(\'modelbas\', \'model_name\', \'image\') do instead

insert into public.imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.id,
  new.source,
  new.source_type,
  new.target,
  new.purpose );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.document_assignment 
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.document_assignment
  do instead nothing;

","
  
create or replace rule \\"_DELETE_DOC\\" as on delete to xm.document_assignment
  where old.target_type != private.get_id(\'modelbas\', \'model_name\', \'image\') do instead

delete from public.docass 
where ( docass_id = old.id );

","

create or replace rule \\"_DELETE_IMG\\" as on delete to xm.document_assignment
  where old.target_type = private.get_id(\'modelbas\', \'model_name\', \'image\') do instead

delete from public.imageass
where ( imageass_id = old.id );

"}',

-- Conditions, Comment, System, Nested

'{}', 'Document Assignment Model', true, true);