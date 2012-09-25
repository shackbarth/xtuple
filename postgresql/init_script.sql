-- [ START ] initdb

-- create languages
\i create_plv8.sql;

-- create schemas
\i create_xt_schema.sql;

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
\i xt/functions/create_table.sql;
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

-- xt operators
\i xt/operators/any_numeric.sql;
\i xt/operators/any_text.sql;
\i xt/operators/begins_with.sql;
\i xt/operators/ends_with.sql;
\i xt/operators/text_gt_date.sql;
\i xt/operators/text_lt_date.sql;

\i xt/tables/js.sql
\i xt/tables/orm.sql
\i xt/tables/useracct.sql

-- xt javascript
\i xt/javascript/data.sql;
\i xt/javascript/orm.sql;
\i xt/javascript/session.sql;

-- delete system orms
\i delete_system_orms.sql;

-- [ END ] xt

