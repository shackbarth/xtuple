select private.create_model(

-- Model name, schema, table

'honorific', 'public', 'hnfc',

-- Columns

E'{
  "hnfc.hnfc_id as guid",
  "hnfc.hnfc_code as code"}',
     
-- sequence

'public.hnfc_hnfc_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.honorific
  do instead

insert into public.hnfc (
  hnfc_id,
  hnfc_code )
values (
  new.guid,
  new.code );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.honorific
  do instead

update public.hnfc set
  hnfc_code = new.code
where ( hnfc_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.honorific
  do instead 
  
delete from public.hnfc
where ( hnfc_id = old.guid );

"}', 

-- Conditions, Comment, System
'{}', 'Honorific Model', true);
