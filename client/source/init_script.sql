-- [ START ] initdb

-- run core orm scripts
\cd ../../orm/source;
\i init_script.sql;
\cd ../../client/source;

-- drop xm views
\i ../../orm/source/drop_xm_views.sql;

-- [ END ] initdb

-- [ START ] xt

-- xt functions
\i xt/functions/cntctmerge.sql;
\i xt/functions/cntctrestore.sql;
\i xt/functions/createuser.sql;
\i xt/functions/mergecrmaccts.sql;
\i xt/functions/undomerge.sql;

-- xt trigger functions
\i xt/trigger_functions/comment_did_change.sql
\i xt/trigger_functions/useracct_did_change.sql
\i xt/trigger_functions/usrpref_did_change.sql

-- xt tables
\i xt/tables/emlprofile.sql
\i xt/tables/incdtemlprofile.sql
\i xt/tables/incdtcatemlprofile.sql
\i xt/tables/priv.sql
\i xt/tables/useracct.sql

-- xt javascript
\i xt/javascript/init.sql;

-- xt views

\i xt/views/doc.sql;
\i xt/views/crmacctaddr.sql;
\i xt/views/crmacctcomment.sql;
\i xt/views/incdtinfo.sql;
\i xt/views/opheadinfo.sql;
\i xt/views/prjinfo.sql;
\i xt/views/todoiteminfo.sql;
\i xt/views/usr.sql;

-- delete system orms
\i ../../orm/source/delete_system_orms.sql;

-- [ END ] xt

-- [ START ] xm

-- xm/javascript
\i xm/javascript/address.sql;
\i xm/javascript/contact.sql;
\i xm/javascript/crm.sql;
\i xm/javascript/database_information.sql;
\i xm/javascript/incident.sql;
\i xm/javascript/model.sql;
\i xm/javascript/project.sql;
\i xm/javascript/to_do.sql;
-- [ END ] xm

-- xtbatch (TODO: This should be moved elsewhere)
\i create_xtbatch_schema.sql;
\i xtbatch/tables/batch.sql

-- public
\i public/functions/geteffectivextuser.sql;
\i public/tables/comment.sql
\i public/tables/schemaord.sql;
\i public/tables/usrpref.sql;

-- xc
\i xc/schema/xc.sql;
\i xc/views/userpriv.sql
\i xc/views/userrole.sql;
\i xc/views/userrolepriv.sql;
\i xc/views/useruserrole.sql;
