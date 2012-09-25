-- [ START ] initdb

-- create languages
\i create_plv8.sql;

-- create schemas
\i create_xt_schema.sql;
\i create_xm_schema.sql;

-- drop xm views
\i drop_xm_views.sql;

-- [ END ] initdb

-- [ START ] xt

-- xt functions
\i xt/functions/add_column.sql;
\i xt/functions/add_constraint.sql;
\i xt/functions/add_primary_key.sql;
\i xt/functions/any_numeric.sql;
\i xt/functions/any_text.sql;
\i xt/functions/begins_with.sql;
\i xt/functions/commit_record.sql;
\i xt/functions/cntctmerge.sql;
\i xt/functions/cntctrestore.sql;
\i xt/functions/create_table.sql;
\i xt/functions/createuser.sql;
\i xt/functions/dispatch.sql;
\i xt/functions/ends_with.sql;
\i xt/functions/execute_query.sql;
\i xt/functions/fetch.sql;
\i xt/functions/get_id.sql;
\i xt/functions/geteffectivextuser.sql;
\i xt/functions/js_init.sql;
\i xt/functions/install_js.sql;
\i xt/functions/install_orm.sql;
\i xt/functions/is_date.sql;
\i xt/functions/raise_exception.sql;
\i xt/functions/retrieve_record.sql;
\i xt/functions/seteffectivextuser.sql;
\i xt/functions/text_gt_date.sql;
\i xt/functions/text_lt_date.sql;

-- xt trigger functions
\i xt/trigger_functions/orm_did_change.sql
\i xt/trigger_functions/comment_did_change.sql

-- xt operators
\i xt/operators/any_numeric.sql;
\i xt/operators/any_text.sql;
\i xt/operators/begins_with.sql;
\i xt/operators/ends_with.sql;
\i xt/operators/text_gt_date.sql;
\i xt/operators/text_lt_date.sql;

-- xt tables
\i xt/tables/comment.sql
\i xt/tables/emlprofile.sql
\i xt/tables/incdtemlprofile.sql
\i xt/tables/incdtcatemlprofile.sql
\i xt/tables/js.sql
\i xt/tables/orm.sql
\i xt/tables/useracct.sql

-- xt javascript
\i xt/javascript/data.sql;
\i xt/javascript/orm.sql;
\i xt/javascript/session.sql;

-- xt views

\i xt/views/doc.sql;
\i xt/views/crmacctaddr.sql;
\i xt/views/crmacctcomment.sql;
\i xt/views/incdtinfo.sql;
\i xt/views/nodeusr.sql;
\i xt/views/opheadinfo.sql;
\i xt/views/prjinfo.sql;
\i xt/views/todoiteminfo.sql;

-- delete system orms
\i delete_system_orms.sql;

-- [ END ] xt

-- [ START ] xm

-- xm/javascript
\i xm/javascript/address.sql;
\i xm/javascript/contact.sql;
\i xm/javascript/crm.sql;
\i xm/javascript/database_information.sql;
\i xm/javascript/incident.sql;
\i xm/javascript/item.sql;
\i xm/javascript/model.sql;
\i xm/javascript/project.sql;
\i xm/javascript/to_do.sql;
-- [ END ] xm

-- xtbatch (TODO: This should be moved elsewhere)
\i create_xtbatch_schema.sql;
\i xtbatch/tables/batch.sql
