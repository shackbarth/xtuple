-- [ START ] initdb

-- run core orm scripts
\cd ../../../lib/orm/source;
\i init_script.sql;
\cd ../../../enyo-client/database/source;

-- delete system orms
\i drop_xm_views.sql;
\i delete_system_orms.sql;

-- [ END ] initdb

-- [ START ] xt

-- xt functions
\i xt/functions/add_priv.sql;
\i xt/functions/cntctmerge.sql;
\i xt/functions/cntctrestore.sql;
\i xt/functions/createuser.sql;
\i xt/functions/install_guiscript.sql;
\i xt/functions/mergecrmaccts.sql;
\i xt/functions/pg_advisory_unlock.sql;
\i xt/functions/quote_line_customer_discount.sql;
\i xt/functions/quote_line_list_cost_markup.sql;
\i xt/functions/quote_line_extended_price.sql;
\i xt/functions/quote_line_profit.sql;
\i xt/functions/quote_line_list_price.sql;
\i xt/functions/quote_line_list_price_discount.sql;
\i xt/functions/quote_line_tax.sql;
\i xt/functions/quote_schedule_date.sql;
\i xt/functions/quote_subtotal.sql;
\i xt/functions/quote_tax_total.sql;
\i xt/functions/quote_total.sql;
\i xt/functions/quote_total_cost.sql;
\i xt/functions/quote_margin.sql;
\i xt/functions/trylock.sql;
\i xt/functions/undomerge.sql;
\i xt/functions/user_account_sync.sql

-- xt trigger functions
\i xt/trigger_functions/comment_did_change.sql
\i xt/trigger_functions/useracct_did_change.sql
\i xt/trigger_functions/grp_did_change.sql
\i xt/trigger_functions/grppriv_did_change.sql
\i xt/trigger_functions/usrgrp_did_change.sql
\i xt/trigger_functions/usrpriv_did_change.sql
\i xt/trigger_functions/usrpref_did_change.sql

-- xt tables
\i xt/tables/emlprofile.sql
\i xt/tables/incdtemlprofile.sql
\i xt/tables/incdtcatemlprofile.sql
\i xt/tables/pkgcmd.sql
\i xt/tables/pkgcmdarg.sql
\i xt/tables/pkgimage.sql
\i xt/tables/pkgmetasql.sql
\i xt/tables/pkgpriv.sql
\i xt/tables/pkgreport.sql
\i xt/tables/pkgscript.sql
\i xt/tables/pkguiform.sql
\i xt/tables/priv.sql
\i xt/tables/useracct.sql
\i xt/tables/userpriv.sql
\i xt/tables/userrole.sql
\i xt/tables/userrolepriv.sql
\i xt/tables/useruserrole.sql

-- xt javascript
\i xt/javascript/init.sql;

-- xt views

\i xt/views/doc.sql;
\i xt/views/crmacctaddr.sql;
\i xt/views/crmacctcomment.sql;
\i xt/views/customer_prospect.sql;
\i xt/views/cust_doc.sql;
\i xt/views/incdtinfo.sql;
\i xt/views/opheadinfo.sql;
\i xt/views/prjinfo.sql;
\i xt/views/quheadinfo.sql;
\i xt/views/quiteminfo.sql;
\i xt/views/todoiteminfo.sql;
\i xt/views/usr.sql;

-- xt guiscripts

\i xt/guiscripts/user.sql;
\i xt/guiscripts/users.sql;
\i xt/guiscripts/userPreferences.sql;

-- [ END ] xt

-- [ START ] xm

-- xm/javascript
\i xm/javascript/account.sql;
\i xm/javascript/address.sql;
\i xm/javascript/contact.sql;
\i xm/javascript/crm.sql;
\i xm/javascript/customer.sql;
\i xm/javascript/database_information.sql;
\i xm/javascript/incident.sql;
\i xm/javascript/item.sql;
\i xm/javascript/project.sql;
\i xm/javascript/quote.sql;
\i xm/javascript/to_do.sql;
-- [ END ] xm

-- [ START ] public

-- public
\i public/functions/geteffectivextuser.sql

\i public/tables/comment.sql
\i public/tables/grp.sql;
\i public/tables/grppriv.sql;
\i public/tables/itemsite.sql;
\i public/tables/pkghead.sql;
\i public/tables/usrgrp.sql;
\i public/tables/usrpref.sql;
\i public/tables/usrpriv.sql;
\i public/tables/schemaord.sql;
-- [ END ] public

-- xtbatch (TODO: This should be moved elsewhere)
\i create_xtbatch_schema.sql;
\i xtbatch/tables/batch.sql

