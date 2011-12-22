select private.extend_model(

-- Context, name, schema, table, join type, join clause

'crm', 'user','public','crmacct','join','crmacct_usr_username=usr.username',

-- columns

'{"crmacct.crmacct_id as account"}',

-- rules, conditions, comment, sequence, system

'{""}', '{}', 'Extended by Crm', 50, true);