-- [ START ] initdb

-- run core orm scripts
\i delete_system_orms.sql;
\i drop_deprecated.sql;

\cd ../../../lib/orm/source;
\i init_script.sql;
\cd ../../../enyo-client/database/source;

select xt.js_init();

-- [ END ] initdb
\i delete_system_orms.sql;

-- xt trigger functions
\i xt/trigger_functions/comment_did_change.sql
\i xt/trigger_functions/owner_record_did_change.sql
\i xt/trigger_functions/taxtype_record_did_change.sql
\i xt/trigger_functions/usr_did_change.sql

-- [ START ] public

-- public
\i public/functions/geteffectivextuser.sql

\i public/tables/comment.sql
\i public/tables/cntct.sql
\i public/tables/coitem.sql
\i public/tables/crmacct.sql
\i public/tables/custinfo.sql
\i public/tables/docass.sql
\i public/tables/grppriv.sql
\i public/tables/incdt.sql
\i public/tables/itemsite.sql;
\i public/tables/prj.sql
\i public/tables/prjtask.sql
\i public/tables/ophead.sql
\i public/tables/quitem.sql
\i public/tables/todoitem.sql
\i public/tables/usrpriv.sql
-- [ END ] public

-- [ START ] xt

-- xt functions
\i xt/functions/add_priv.sql;
\i xt/functions/average_cost.sql;
\i xt/functions/change_password.sql;
\i xt/functions/co_line_base_price.sql;
\i xt/functions/co_line_customer_discount.sql;
\i xt/functions/co_line_markup.sql;
\i xt/functions/co_line_extended_price.sql;
\i xt/functions/co_line_profit.sql;
\i xt/functions/co_line_list_price.sql;
\i xt/functions/co_line_list_price_discount.sql;
\i xt/functions/co_line_tax.sql;
\i xt/functions/co_freight_weight.sql;
\i xt/functions/co_schedule_date.sql;
\i xt/functions/co_subtotal.sql;
\i xt/functions/co_tax_total.sql;
\i xt/functions/co_total.sql;
\i xt/functions/co_total_cost.sql;
\i xt/functions/co_margin.sql;
\i xt/functions/cntctmerge.sql;
\i xt/functions/cntctrestore.sql;
\i xt/functions/install_guiscript.sql;
\i xt/functions/mergecrmaccts.sql;
\i xt/functions/pg_advisory_unlock.sql;
\i xt/functions/quote_line_base_price.sql;
\i xt/functions/quote_line_customer_discount.sql;
\i xt/functions/quote_line_markup.sql;
\i xt/functions/quote_line_extended_price.sql;
\i xt/functions/quote_line_profit.sql;
\i xt/functions/quote_line_list_price.sql;
\i xt/functions/quote_line_list_price_discount.sql;
\i xt/functions/quote_line_tax.sql;
\i xt/functions/quote_freight_weight.sql;
\i xt/functions/quote_schedule_date.sql;
\i xt/functions/quote_subtotal.sql;
\i xt/functions/quote_tax_total.sql;
\i xt/functions/quote_total.sql;
\i xt/functions/quote_total_cost.sql;
\i xt/functions/quote_margin.sql;
\i xt/functions/register_extension.sql;
\i xt/functions/trylock.sql;
\i xt/functions/undomerge.sql;

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

\i xt/tables/ext.sql
\i xt/tables/grpext.sql
\i xt/tables/usrext.sql
\i xt/tables/sessionstore.sql
\i xt/tables/oa2client.sql
\i xt/tables/oa2clientredirs.sql
\i xt/tables/oa2token.sql
\i xt/tables/bicache.sql

-- xt javascript
\i xt/javascript/init.sql;

-- xt views

\i xt/views/doc.sql;
\i xt/views/cntctinfo.sql;
\i xt/views/coheadinfo.sql;
\i xt/views/coiteminfo.sql;
\i xt/views/crmacctaddr.sql;
\i xt/views/crmacctcomment.sql;
\i xt/views/customer_prospect.sql;
\i xt/views/cust_doc.sql;
\i xt/views/incdtinfo.sql;
\i xt/views/incdtxt.sql;
\i xt/views/iteminfo.sql;
\i xt/views/itemsiteinfo.sql;
\i xt/views/opheadinfo.sql;
\i xt/views/prjinfo.sql;
\i xt/views/quheadinfo.sql;
\i xt/views/quiteminfo.sql;
\i xt/views/site.sql;
\i xt/views/todoiteminfo.sql;
\i xt/views/usrinfo.sql;


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
\i xm/javascript/item_site.sql;
\i xm/javascript/project.sql;
\i xm/javascript/quote.sql;
\i xm/javascript/sales.sql;
\i xm/javascript/tax.sql;
\i xm/javascript/to_do.sql;
-- [ END ] xm

-- [ START ] public

-- public
\i public/tables/comment_trigger.sql
\i public/tables/pkghead.sql;
\i public/tables/schemaord.sql;

-- [ END ] public

-- xtbatch (TODO: This should be moved elsewhere)
\i create_xtbatch_schema.sql;
\i xtbatch/tables/batch.sql

\i update_version.sql;

