select private.create_model(

-- Model name, schema, table

'contact_email', 'public', 'cntcteml',

-- Columns

E'{
  "cntcteml.cntcteml_id as guid",
  "cntcteml.cntcteml_cntct_id as contact",
  "cntcteml.cntcteml_email as email"}',
     
-- sequence

'public.cntcteml_cntcteml_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.contact_email 
  do instead

insert into public.cntcteml (
  cntcteml_id,
  cntcteml_cntct_id,
  cntcteml_email )
values (
  new.guid,
  new.contact,
  new.email );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_email 
  do instead

update public.cntcteml set
  cntcteml_email = new.email
where ( cntcteml_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.contact_email 
  do instead

delete from public.cntcteml 
where ( cntcteml_id = old.guid );

"}', 

-- Conditions, Comment, System, Nested
'{}', 'Contact Email Model', true, true);