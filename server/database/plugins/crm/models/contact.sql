select private.extend_model(

-- Context, name, schema, table, join type, join clause

'crm', 'contact','public','cntct crm','join','cntct.cntct_id=crm.cntct_id',

-- columns

'{"crm.cntct_crmacct_id as account"}',

-- rules

E'{"

-- insert rule

create or replace rule \\"_INSERT_CRM\\" as on insert to xm.contact 
  do instead

update cntct set
  cntct_crmacct_id = new.account
where ( cntct_id = new.id );

","

-- update rule

create or replace rule \\"_UPDATE_CRM\\" as on update to xm.contact 
  do instead

update cntct set
  cntct_crmacct_id = new.account
where ( cntct_id = old.id );

"}', 

-- conditions, comment, sequence, system

'{}', 'Extended by Crm', 50, true);