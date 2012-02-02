select private.create_model(

-- Model name, schema

'opportunity_opportunity', '', 'xm.opportunity_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "opportunity_info as opportunity",
  "docinfo.purpose as purpose"
}',

-- sequence

'public.docass_docass_id_seq',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity_opportunity
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
  (new.opportunity).guid,
  \'OPP\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.opportunity_opportunity
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.opportunity_opportunity
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"opportunity_info.guid=target_id","docinfo.source_type=\'OPP\'","docinfo.target_type=\'OPP\'"}', 'Opportunity Opportunity Model', true, true);