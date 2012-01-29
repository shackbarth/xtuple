select private.create_model(

-- Model name, schema

'account_account', '', 'xm.account_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "account_info as account",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.account_account
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
  \'CRMA\',
  (new.account).guid,
  \'CRMA\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account_account
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.account_account
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"account_info.guid=target_id","docinfo.source_type=\'CRMA\'","docinfo.target_type=\'CRMA\'"}', 'Account Account Model', true, true);