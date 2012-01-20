select private.create_model(

-- Model name, schema

'document_assignment', '', 

-- table

E'(select
    docass_id as guid,
    docass_source_id as source_id,
    docass_target_id as target_id,
    st.datatype_id as source_type,
    tt.datatype_id as target_type,
    docass_purpose as purpose
   from docass
   join private.datatype st on ( docass_source_type = st.datatype_source )
   join private.datatype tt on ( docass_target_type = tt.datatype_source )
   union all
   -- (inverse)
   select
    docass_id as guid,
    docass_target_id as source_id,
    docass_source_id as target_id,
    tt.datatype_id as source_type,
    st.datatype_id as target_type,
    case 
     when docass_purpose = \'A\' then \'C\'
     when docass_purpose = \'C\' then \'A\'
     else docass_purpose
    end as purpose
   from public.docass
   join private.datatype st on ( docass_target_type = st.datatype_source )
   join private.datatype tt on ( docass_source_type = tt.datatype_source )
   union all
   -- images
   select
    imageass_id as guid,
    imageass_source_id as source_id,
    imageass_id as target_id,
    st.datatype_id as source_type,
    tt.datatype_id as target_type,
    imageass_purpose as purpose
   from imageass, private.datatype st, private.datatype tt
   where (  tt.datatype_source = \'IMG\' )
   and ( imageass_source = st.datatype_source)) documents',

-- Columns

E'{
  "documents.guid as guid",
  "documents.source_id as source",
  "documents.target_id as target",
  "documents.source_type as source_type",
  "documents.target_type as target_type",
  "documents.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.document_assignment 
  do instead nothing;
  
create or replace rule \\"_CREATE_DOC\\" as on insert to xm.document_assignment 
  where new.target_type != private.get_id(\'datatype\', \'datatype_name\', \'Image\') do instead

insert into public.docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.guid,
  new.source,
  private.get_datatype_source(new.source_type),
  new.target,
  private.get_datatype_source(new.target_type),
  new.purpose );

create or replace rule \\"_CREATE_IMG\\" as on insert to xm.document_assignment 
  where new.target_type = private.get_id(\'datatype\', \'datatype_name\', \'Image\') do instead

insert into public.imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.guid,
  new.source,
  private.get_datatype_source(new.source_type),
  new.target,
  new.purpose );

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.document_assignment 
  do instead nothing;

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.document_assignment
  do instead nothing;
  
create or replace rule \\"_DELETE_DOC\\" as on delete to xm.document_assignment
  where old.target_type != private.get_id(\'datatype\', \'datatype_name\', \'Image\') do instead

delete from public.docass 
where ( docass_id = old.guid );

create or replace rule \\"_DELETE_IMG\\" as on delete to xm.document_assignment
  where old.target_type = private.get_id(\'datatype\', \'datatype_name\', \'Image\') do instead

delete from public.imageass
where ( imageass_id = old.guid );

"}',

-- Conditions, Comment, System, Nested

'{}', 'Document Assignment Model', true, true);