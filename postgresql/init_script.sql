-- [ START ] initdb

-- create schemas
\i create_private_schema.sql;
\i create_xm_schema.sql;

-- create languages
\i create_plv8.sql;

-- [ END ] initdb

-- [ START ] private

-- private functions
\i private/functions/add_column.sql;
\i private/functions/add_constraint.sql;
\i private/functions/add_primary_key.sql;
\i private/functions/any_numeric.sql;
\i private/functions/any_text.sql;
\i private/functions/commit_record.sql;
\i private/functions/create_table.sql;
\i private/functions/create_orm_view.sql;
\i private/functions/dispatch.sql;
\i private/functions/drop_orm_view.sql;
\i private/functions/ends_with.sql;
\i private/functions/execute_query.sql;
\i private/functions/fetch.sql;
\i private/functions/get_id.sql;
\i private/functions/js_init.sql;
\i private/functions/install_orm.sql;
\i private/functions/is_date.sql;
\i private/functions/raise_exception.sql;
\i private/functions/register_js.sql;
\i private/functions/retrieve_record.sql;
\i private/functions/starts_with.sql;
\i private/functions/text_gt_date.sql;
\i private/functions/text_lt_date.sql;
\i private/functions/validate_user.sql;

-- private javascript
\i private/javascript/data.sql;
\i private/javascript/session.sql;

-- private trigger functions
\i private/trigger_functions/orm_did_change.sql
\i private/trigger_functions/useracct_duplicate_check.sql

-- private operators
\i private/operators/any_numeric.sql;
\i private/operators/any_text.sql;
\i private/operators/ends_with.sql;
\i private/operators/starts_with.sql;
\i private/operators/text_gt_date.sql;
\i private/operators/text_lt_date.sql;

-- private tables
\i private/tables/js.sql
\i private/tables/orm.sql
\i private/tables/useracct.sql

-- private views
\i private/views/comment.sql;
\i private/views/docinfo.sql; 
\i private/views/usr.sql;

-- [ END ] private

-- [ START ] xm

-- xm/javascript
\i xm/javascript/address.sql;

-- [ END ] xm
