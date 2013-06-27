-- [ START ] initdb

-- create languages
\i create_plv8.sql;

-- create schemas
\i create_xt_schema.sql;
\i create_xm_schema.sql;
\i create_sys_schema.sql;

-- [ END ] initdb

-- [ START ] xt

-- xt functions
\i xt/functions/add_column.sql;
\i xt/functions/add_constraint.sql;
\i xt/functions/add_index.sql;
\i xt/functions/add_primary_key.sql;
\i xt/functions/any_numeric.sql;
\i xt/functions/any_text.sql;
\i xt/functions/begins_with.sql;
\i xt/functions/commit_record.sql;
\i xt/functions/create_table.sql;
\i xt/functions/create_view.sql;
\i xt/functions/decamelize.sql;
\i xt/functions/delete.sql;
\i xt/functions/dispatch.sql;
\i xt/functions/ends_with.sql;
\i xt/functions/execute_query.sql;
\i xt/functions/fetch.sql;
\i xt/functions/generate_uuid.sql;
\i xt/functions/get.sql;
\i xt/functions/get_id.sql;
\i xt/functions/js_init.sql;
\i xt/functions/install_js.sql;
\i xt/functions/install_orm.sql;
\i xt/functions/is_date.sql;
\i xt/functions/not_any_numeric.sql;
\i xt/functions/not_any_text.sql;
\i xt/functions/post.sql;
\i xt/functions/patch.sql;
\i xt/functions/raise_exception.sql;
\i xt/functions/retrieve_record.sql;
\i xt/functions/schema.sql;
\i xt/functions/show_search_path.sql;
\i xt/functions/text_gt_date.sql;
\i xt/functions/text_lt_date.sql;

-- xt trigger functions
\i xt/trigger_functions/orm_did_change.sql
\i xt/trigger_functions/record_did_change.sql

-- xt operators
\i xt/operators/any_numeric.sql;
\i xt/operators/any_text.sql;
\i xt/operators/begins_with.sql;
\i xt/operators/ends_with.sql;
\i xt/operators/not_any_numeric.sql;
\i xt/operators/not_any_text.sql;
\i xt/operators/text_gt_date.sql;
\i xt/operators/text_lt_date.sql;

-- xt tables
\i xt/tables/js.sql
\i xt/tables/lock.sql
\i xt/tables/orm.sql
\i xt/tables/ver.sql

-- xt javascript
\i xt/javascript/data.sql;
\i xt/javascript/jsonpatch.sql;
\i xt/javascript/orm.sql;
\i xt/javascript/session.sql;
\i xt/javascript/schema.sql;
\i xt/javascript/discovery.sql;

-- [ END ] xt

-- [ START ] xm

-- xm javascript
\i xm/javascript/model.sql;

-- [ END ] xm
