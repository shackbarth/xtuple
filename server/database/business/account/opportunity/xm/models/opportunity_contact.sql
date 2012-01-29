select private.create_model(

-- Model name, schema

'opportunity_contact', '', 'xm.contact_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "contact_info as contact",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity_contact
  do instead

insert into private.docinfo (
  id,
  source_id,
  source_type,
  target_id,
  target_type,
  purpose )
values (
  new.guid,
  new.source,
  \'OPP\',
  (new.contact).guid,
  \'T\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.opportunity_contact
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.opportunity_contact 
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"contact_info.guid=target_id","docinfo.source_type=\'OPP\'","docinfo.target_type=\'T\'"}', 'Opportunity Contact Model', true, true);